using PiiStudio.Api.Models;

namespace PiiStudio.Api.Services;

/// <summary>
/// Server-side post-processing for the <c>entityMaskWithNumericSuffix</c>
/// redaction policy, which Azure AI Language does not implement natively.
/// </summary>
/// <remarks>
/// We always request <c>noMask</c> from Azure (so we get clean entity offsets),
/// optionally apply value-level filters (excluded values, synonym canonicalisation,
/// minimum confidence), and then walk the entities left→right rewriting the
/// original text with tokens of the form <c>[CATEGORY_n]</c>. Same surface value
/// re-uses the same token; new value of the same category increments the suffix.
///
/// The resulting <see cref="MappingEntry"/> list is the reverse-lookup table
/// the SPA renders in the Tokenization Map and uses to rehydrate LLM responses.
/// </remarks>
public sealed class TokenizationService
{
    /// <summary>
    /// Applies <paramref name="request"/>'s redaction policy to the entity list
    /// returned by Azure and produces a redacted string plus mapping table.
    /// </summary>
    /// <param name="originalText">The original input text (used for offset slicing).</param>
    /// <param name="azureEntities">Entities as returned by Azure (already in offset order or arbitrary).</param>
    /// <param name="request">The inbound proxy request carrying policy + filters.</param>
    /// <returns>
    /// A tuple of <c>(redactedText, mapping, filteredEntities)</c>. The mapping is
    /// empty for non-tokenizing policies (<c>noMask</c>, <c>characterMask</c>, <c>entityMask</c>).
    /// </returns>
    public (string redactedText, List<MappingEntry> mapping, List<EntityDto> entities)
        Apply(string originalText, List<EntityDto> azureEntities, PiiAnalyzeRequest request)
    {
        var filtered = FilterAndCanonicalise(azureEntities, request);

        // For any policy other than the suffix variant we still produce the redacted
        // text ourselves so the behaviour is consistent across API versions.
        return request.RedactionPolicy switch
        {
            "noMask" => (originalText, new List<MappingEntry>(), filtered),
            "characterMask" => (MaskCharacters(originalText, filtered, request.RedactionCharacter), new List<MappingEntry>(), filtered),
            "entityMask" => (MaskEntityNames(originalText, filtered, withSuffix: false, out _), new List<MappingEntry>(), filtered),
            "entityMaskWithNumericSuffix" => MaskWithSuffix(originalText, filtered),
            _ => (MaskEntityNames(originalText, filtered, withSuffix: false, out _), new List<MappingEntry>(), filtered)
        };
    }

    private static List<EntityDto> FilterAndCanonicalise(List<EntityDto> entities, PiiAnalyzeRequest request)
    {
        var excluded = new HashSet<string>(request.ExcludedValues, StringComparer.OrdinalIgnoreCase);

        // Synonym map: any value in the values-list (or the key itself) canonicalises to the key.
        var canonicaliser = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        foreach (var (canonical, aliases) in request.Synonyms)
        {
            canonicaliser[canonical] = canonical;
            foreach (var alias in aliases) canonicaliser[alias] = canonical;
        }

        var output = new List<EntityDto>(entities.Count);
        foreach (var e in entities)
        {
            if (e.ConfidenceScore < request.MinimumConfidenceScore) continue;
            if (excluded.Contains(e.Text)) continue;

            var dto = new EntityDto
            {
                Text = canonicaliser.TryGetValue(e.Text, out var canon) ? canon : e.Text,
                Category = e.Category,
                Subcategory = e.Subcategory,
                ConfidenceScore = e.ConfidenceScore,
                Offset = e.Offset,
                Length = e.Length
            };
            output.Add(dto);
        }

        // Sort by offset for deterministic left→right tokenisation.
        output.Sort((a, b) => a.Offset.CompareTo(b.Offset));
        return output;
    }

    private static string MaskCharacters(string originalText, List<EntityDto> entities, string maskChar)
    {
        if (string.IsNullOrEmpty(maskChar)) maskChar = "*";

        var builder = new System.Text.StringBuilder(originalText);
        // Apply right-to-left so offsets stay valid as we mutate.
        foreach (var e in entities.OrderByDescending(x => x.Offset))
        {
            if (e.Offset < 0 || e.Offset + e.Length > builder.Length) continue;
            builder.Remove(e.Offset, e.Length);
            builder.Insert(e.Offset, string.Concat(Enumerable.Repeat(maskChar[0], e.Length)));
        }
        return builder.ToString();
    }

    private static string MaskEntityNames(string originalText, List<EntityDto> entities, bool withSuffix, out List<MappingEntry> mapping)
    {
        mapping = new List<MappingEntry>();
        var builder = new System.Text.StringBuilder(originalText);
        foreach (var e in entities.OrderByDescending(x => x.Offset))
        {
            if (e.Offset < 0 || e.Offset + e.Length > builder.Length) continue;
            var token = withSuffix ? $"[{e.Category.ToUpperInvariant()}_1]" : $"[{e.Category.ToUpperInvariant()}]";
            builder.Remove(e.Offset, e.Length);
            builder.Insert(e.Offset, token);
        }
        return builder.ToString();
    }

    private static (string redactedText, List<MappingEntry> mapping, List<EntityDto> entities)
        MaskWithSuffix(string originalText, List<EntityDto> entities)
    {
        // Per-category running index. Same surface VALUE within a category re-uses the same token.
        var perCategoryIndex = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        var tokensByValueKey = new Dictionary<string, MappingEntry>(StringComparer.OrdinalIgnoreCase);

        // First pass: walk left→right assigning tokens.
        foreach (var e in entities)
        {
            var key = $"{e.Category}::{e.Text}";
            if (!tokensByValueKey.TryGetValue(key, out var entry))
            {
                if (!perCategoryIndex.TryGetValue(e.Category, out var idx)) idx = 0;
                idx++;
                perCategoryIndex[e.Category] = idx;
                entry = new MappingEntry
                {
                    Token = $"[{e.Category.ToUpperInvariant()}_{idx}]",
                    OriginalValue = e.Text,
                    Category = e.Category,
                    SubCategory = e.Subcategory,
                    Confidence = e.ConfidenceScore,
                    Occurrences = new List<int>()
                };
                tokensByValueKey[key] = entry;
            }
            entry.Occurrences.Add(e.Offset);
        }

        // Second pass: rewrite text right→left so offsets remain valid.
        var builder = new System.Text.StringBuilder(originalText);
        foreach (var e in entities.OrderByDescending(x => x.Offset))
        {
            if (e.Offset < 0 || e.Offset + e.Length > builder.Length) continue;
            var key = $"{e.Category}::{e.Text}";
            if (!tokensByValueKey.TryGetValue(key, out var entry)) continue;
            builder.Remove(e.Offset, e.Length);
            builder.Insert(e.Offset, entry.Token);
        }

        var mapping = tokensByValueKey.Values
            .OrderBy(m => m.Category, StringComparer.OrdinalIgnoreCase)
            .ThenBy(m => m.Token, StringComparer.OrdinalIgnoreCase)
            .ToList();

        return (builder.ToString(), mapping, entities);
    }
}
