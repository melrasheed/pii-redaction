using System.Text.Json.Serialization;

namespace PiiStudio.Api.Models;

/// <summary>
/// Inbound request from the SPA to <c>POST /api/pii/analyze</c>.
/// Mirrors the configuration surface of Azure AI Language → Text PII
/// plus client-side post-processing knobs the proxy applies before
/// returning a result.
/// </summary>
public sealed class PiiAnalyzeRequest
{
    /// <summary>Free-form text to analyse. Required.</summary>
    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;

    /// <summary>BCP-47 language code passed to Azure (e.g. <c>en</c>, <c>ar</c>).</summary>
    [JsonPropertyName("language")]
    public string Language { get; set; } = "en";

    /// <summary>Azure AI Language REST API version (e.g. <c>2026-05-01</c>).</summary>
    [JsonPropertyName("apiVersion")]
    public string ApiVersion { get; set; } = "2026-05-01";

    /// <summary>PII model version. Defaults to <c>latest</c>.</summary>
    [JsonPropertyName("modelVersion")]
    public string ModelVersion { get; set; } = "latest";

    /// <summary>Domain hint. <c>none</c> (default) or <c>phi</c> for protected health information.</summary>
    [JsonPropertyName("domain")]
    public string Domain { get; set; } = "none";

    /// <summary>If non-empty, only these PII categories are returned.</summary>
    [JsonPropertyName("piiCategories")]
    public List<string> PiiCategories { get; set; } = new();

    /// <summary>If non-empty, these PII categories are excluded from the response.</summary>
    [JsonPropertyName("excludePiiCategories")]
    public List<string> ExcludePiiCategories { get; set; } = new();

    /// <summary>
    /// Redaction policy. One of <c>noMask</c>, <c>characterMask</c>, <c>entityMask</c>,
    /// or <c>entityMaskWithNumericSuffix</c>. The last is implemented by the proxy as
    /// a post-pass over the GA <c>noMask</c> response so it works on every API version.
    /// </summary>
    [JsonPropertyName("redactionPolicy")]
    public string RedactionPolicy { get; set; } = "entityMask";

    /// <summary>Character used when <see cref="RedactionPolicy"/> is <c>characterMask</c>.</summary>
    [JsonPropertyName("redactionCharacter")]
    public string RedactionCharacter { get; set; } = "*";

    /// <summary>Client-side filter — drop entities below this confidence (0.0–1.0).</summary>
    [JsonPropertyName("minimumConfidenceScore")]
    public double MinimumConfidenceScore { get; set; }

    /// <summary>Exact string values that should be ignored even if Azure flags them.</summary>
    [JsonPropertyName("excludedValues")]
    public List<string> ExcludedValues { get; set; } = new();

    /// <summary>
    /// Synonym map. Any entity whose surface text matches a key OR any of its values
    /// is rewritten as the canonical key before tokenization (so e.g. <c>MSFT</c> and
    /// <c>Microsoft Corporation</c> share a single token).
    /// </summary>
    [JsonPropertyName("synonyms")]
    public Dictionary<string, List<string>> Synonyms { get; set; } = new();

    /// <summary>If <c>true</c>, forwards <c>loggingOptOut=true</c> to Azure.</summary>
    [JsonPropertyName("loggingOptOut")]
    public bool LoggingOptOut { get; set; } = true;

    /// <summary>Index unit for entity offsets/lengths. Defaults to <c>Utf16CodeUnit</c>.</summary>
    [JsonPropertyName("stringIndexType")]
    public string StringIndexType { get; set; } = "Utf16CodeUnit";

    /// <summary>If <c>true</c>, forwards <c>showStats=true</c> to Azure.</summary>
    [JsonPropertyName("showStats")]
    public bool ShowStats { get; set; }
}
