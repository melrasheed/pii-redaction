using System.Text.Json;
using System.Text.Json.Serialization;

namespace PiiStudio.Api.Models;

/// <summary>
/// Surface returned from the proxy when an upstream call fails. The SPA's
/// MessageBar renders <see cref="ErrorCode"/> and <see cref="Message"/>
/// verbatim and offers a "Show details" expander for <see cref="Raw"/>.
/// </summary>
public sealed class ProxyError
{
    [JsonPropertyName("errorCode")]
    public string ErrorCode { get; set; } = "Unknown";

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public int Status { get; set; }

    /// <summary>Verbatim upstream body (may be plain text wrapped as a JSON string).</summary>
    [JsonPropertyName("raw")]
    public JsonElement Raw { get; set; }

    [JsonPropertyName("retryAfterSeconds")]
    public int? RetryAfterSeconds { get; set; }
}
