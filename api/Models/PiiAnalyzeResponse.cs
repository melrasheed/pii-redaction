using System.Text.Json;
using System.Text.Json.Serialization;

namespace PiiStudio.Api.Models;

/// <summary>A single entity returned to the SPA (post-filtering, post-synonym).</summary>
public sealed class EntityDto
{
    /// <summary>Exact surface text Azure flagged.</summary>
    [JsonPropertyName("text")]
    public string Text { get; set; } = string.Empty;

    /// <summary>Top-level Microsoft category, e.g. <c>Person</c>, <c>PhoneNumber</c>.</summary>
    [JsonPropertyName("category")]
    public string Category { get; set; } = string.Empty;

    /// <summary>Optional subcategory, e.g. <c>Date</c>, <c>Number</c>.</summary>
    [JsonPropertyName("subcategory")]
    public string? Subcategory { get; set; }

    /// <summary>Confidence 0–1.</summary>
    [JsonPropertyName("confidenceScore")]
    public double ConfidenceScore { get; set; }

    /// <summary>Character offset into the original text (per <c>stringIndexType</c>).</summary>
    [JsonPropertyName("offset")]
    public int Offset { get; set; }

    /// <summary>Character length (per <c>stringIndexType</c>).</summary>
    [JsonPropertyName("length")]
    public int Length { get; set; }
}

/// <summary>
/// One row of the tokenization map (token ↔ original value) returned when
/// <c>redactionPolicy = entityMaskWithNumericSuffix</c>.
/// </summary>
public sealed class MappingEntry
{
    /// <summary>The opaque token written into the redacted text, e.g. <c>[PERSON_1]</c>.</summary>
    [JsonPropertyName("token")]
    public string Token { get; set; } = string.Empty;

    /// <summary>The original surface value the token replaces.</summary>
    [JsonPropertyName("originalValue")]
    public string OriginalValue { get; set; } = string.Empty;

    /// <summary>Microsoft category.</summary>
    [JsonPropertyName("category")]
    public string Category { get; set; } = string.Empty;

    /// <summary>Microsoft subcategory if present.</summary>
    [JsonPropertyName("subCategory")]
    public string? SubCategory { get; set; }

    /// <summary>Confidence of the first matched occurrence.</summary>
    [JsonPropertyName("confidence")]
    public double Confidence { get; set; }

    /// <summary>Every offset in the original text where this value appeared.</summary>
    [JsonPropertyName("occurrences")]
    public List<int> Occurrences { get; set; } = new();
}

/// <summary>A single audit-log entry, also surfaced in the SPA's Audit Drawer.</summary>
public sealed class AuditEntry
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    [JsonPropertyName("timestamp")]
    public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;

    [JsonPropertyName("actor")]
    public string Actor { get; set; } = "local";

    [JsonPropertyName("action")]
    public string Action { get; set; } = string.Empty;

    [JsonPropertyName("details")]
    public string Details { get; set; } = string.Empty;

    [JsonPropertyName("entityCount")]
    public int EntityCount { get; set; }

    [JsonPropertyName("latencyMs")]
    public long LatencyMs { get; set; }

    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("error")]
    public string? Error { get; set; }
}

/// <summary>Response returned by <c>POST /api/pii/analyze</c>.</summary>
public sealed class PiiAnalyzeResponse
{
    [JsonPropertyName("originalText")]
    public string OriginalText { get; set; } = string.Empty;

    [JsonPropertyName("redactedText")]
    public string RedactedText { get; set; } = string.Empty;

    [JsonPropertyName("entities")]
    public List<EntityDto> Entities { get; set; } = new();

    [JsonPropertyName("mapping")]
    public List<MappingEntry> Mapping { get; set; } = new();

    /// <summary>Verbatim JSON body sent to Azure (for the Request Trace panel).</summary>
    [JsonPropertyName("rawRequest")]
    public JsonElement RawRequest { get; set; }

    /// <summary>Verbatim JSON body received from Azure (for the Request Trace panel).</summary>
    [JsonPropertyName("rawResponse")]
    public JsonElement RawResponse { get; set; }

    /// <summary>End-to-end latency measured by the proxy in milliseconds.</summary>
    [JsonPropertyName("latencyMs")]
    public long LatencyMs { get; set; }

    [JsonPropertyName("audit")]
    public AuditEntry Audit { get; set; } = new();
}
