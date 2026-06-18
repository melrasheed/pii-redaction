using System.Diagnostics;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using PiiStudio.Api.Models;

namespace PiiStudio.Api.Services;

/// <summary>
/// Thin client that POSTs a canonical PII detection request to
/// Azure AI Language's <c>/language/:analyze-text</c> endpoint and
/// returns the raw response bodies plus a parsed entity list.
/// </summary>
public sealed class AzureLanguageClient
{
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web)
    {
        WriteIndented = false
    };

    private readonly IHttpClientFactory _httpFactory;
    private readonly ILogger<AzureLanguageClient> _logger;

    /// <summary>Creates a new client. The <see cref="IHttpClientFactory"/> is used per-call so endpoints can vary per request.</summary>
    public AzureLanguageClient(IHttpClientFactory httpFactory, ILogger<AzureLanguageClient> logger)
    {
        _httpFactory = httpFactory;
        _logger = logger;
    }

    /// <summary>
    /// Calls Azure AI Language Text PII and returns the raw bodies, parsed entities, and latency.
    /// Throws <see cref="UpstreamException"/> on any non-2xx response.
    /// </summary>
    /// <param name="endpoint">Azure resource endpoint base URL.</param>
    /// <param name="key">Azure resource key (sent as <c>Ocp-Apim-Subscription-Key</c>).</param>
    /// <param name="request">The validated proxy request.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    public async Task<AzureLanguageResult> AnalyzeAsync(
        string endpoint,
        string key,
        PiiAnalyzeRequest request,
        CancellationToken cancellationToken)
    {
        var rawRequestBody = BuildRequestBody(request);
        var requestJson = JsonSerializer.Serialize(rawRequestBody, JsonOpts);

        var url = BuildUrl(endpoint, request);

        using var http = _httpFactory.CreateClient("azure-language");
        using var message = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = new StringContent(requestJson, Encoding.UTF8, "application/json")
        };
        message.Headers.Add("Ocp-Apim-Subscription-Key", key);

        var sw = Stopwatch.StartNew();
        HttpResponseMessage response;
        try
        {
            response = await http.SendAsync(message, cancellationToken);
        }
        catch (HttpRequestException ex)
        {
            throw new UpstreamException(
                "Network",
                $"Network error calling Azure AI Language: {ex.Message}",
                status: 0,
                raw: JsonDocument.Parse("\"\"").RootElement,
                retryAfter: null);
        }

        var responseText = await response.Content.ReadAsStringAsync(cancellationToken);
        sw.Stop();

        var rawRequestElement = JsonDocument.Parse(requestJson).RootElement.Clone();
        JsonElement rawResponseElement;
        try
        {
            rawResponseElement = JsonDocument.Parse(string.IsNullOrWhiteSpace(responseText) ? "\"\"" : responseText).RootElement.Clone();
        }
        catch (JsonException)
        {
            rawResponseElement = JsonDocument.Parse(JsonSerializer.Serialize(responseText)).RootElement.Clone();
        }

        if (!response.IsSuccessStatusCode)
        {
            int? retryAfter = null;
            if (response.Headers.RetryAfter is { } ra)
            {
                if (ra.Delta is { } delta) retryAfter = (int)delta.TotalSeconds;
                else if (ra.Date is { } date) retryAfter = (int)Math.Max(0, (date - DateTimeOffset.UtcNow).TotalSeconds);
            }
            throw new UpstreamException(
                errorCode: ExtractErrorCode(rawResponseElement) ?? ((int)response.StatusCode).ToString(),
                message: ExtractErrorMessage(rawResponseElement) ?? response.ReasonPhrase ?? "Upstream error",
                status: (int)response.StatusCode,
                raw: rawResponseElement,
                retryAfter: retryAfter);
        }

        var entities = ParseEntities(rawResponseElement);
        return new AzureLanguageResult(rawRequestElement, rawResponseElement, entities, sw.ElapsedMilliseconds);
    }

    /// <summary>Builds the Azure REST URL with API version and optional flags.</summary>
    private static string BuildUrl(string endpoint, PiiAnalyzeRequest request)
    {
        var trimmed = endpoint.TrimEnd('/');
        var query = new List<string>
        {
            $"api-version={Uri.EscapeDataString(request.ApiVersion)}"
        };
        if (request.LoggingOptOut) query.Add("loggingOptOut=true");
        if (request.ShowStats) query.Add("showStats=true");

        // Use Uri.EscapeDataString on the segment so the literal colon in ":analyze-text" survives.
        return $"{trimmed}/language/:analyze-text?{string.Join('&', query)}";
    }

    /// <summary>
    /// Builds the canonical Azure request body. The proxy <em>always</em> uses
    /// <c>noMask</c> upstream so we get clean entity offsets and apply the
    /// caller's policy ourselves in <see cref="TokenizationService"/>.
    /// </summary>
    private static Dictionary<string, object?> BuildRequestBody(PiiAnalyzeRequest request)
    {
        var parameters = new Dictionary<string, object?>
        {
            ["modelVersion"] = string.IsNullOrWhiteSpace(request.ModelVersion) ? "latest" : request.ModelVersion,
            ["stringIndexType"] = request.StringIndexType,
            ["redactionPolicy"] = new Dictionary<string, object?>
            {
                ["policyKind"] = "noMask"
            }
        };

        if (!string.Equals(request.Domain, "none", StringComparison.OrdinalIgnoreCase))
        {
            parameters["domain"] = request.Domain;
        }

        if (request.PiiCategories.Count > 0)
        {
            parameters["piiCategories"] = request.PiiCategories;
        }
        if (request.ExcludePiiCategories.Count > 0)
        {
            parameters["excludePiiCategories"] = request.ExcludePiiCategories;
        }

        var body = new Dictionary<string, object?>
        {
            ["kind"] = "PiiEntityRecognition",
            ["parameters"] = parameters,
            ["analysisInput"] = new Dictionary<string, object?>
            {
                ["documents"] = new[]
                {
                    new Dictionary<string, object?>
                    {
                        ["id"] = "1",
                        ["language"] = request.Language,
                        ["text"] = request.Text
                    }
                }
            }
        };

        return body;
    }

    private static List<EntityDto> ParseEntities(JsonElement root)
    {
        var entities = new List<EntityDto>();
        if (root.ValueKind != JsonValueKind.Object) return entities;

        if (!root.TryGetProperty("results", out var results)) return entities;
        if (!results.TryGetProperty("documents", out var documents)) return entities;
        if (documents.ValueKind != JsonValueKind.Array) return entities;

        foreach (var doc in documents.EnumerateArray())
        {
            if (!doc.TryGetProperty("entities", out var entityArr)) continue;
            foreach (var e in entityArr.EnumerateArray())
            {
                entities.Add(new EntityDto
                {
                    Text = e.TryGetProperty("text", out var t) ? t.GetString() ?? string.Empty : string.Empty,
                    Category = e.TryGetProperty("category", out var c) ? c.GetString() ?? string.Empty : string.Empty,
                    Subcategory = e.TryGetProperty("subcategory", out var sc) ? sc.GetString() : null,
                    ConfidenceScore = e.TryGetProperty("confidenceScore", out var conf) && conf.ValueKind == JsonValueKind.Number ? conf.GetDouble() : 0d,
                    Offset = e.TryGetProperty("offset", out var off) && off.ValueKind == JsonValueKind.Number ? off.GetInt32() : 0,
                    Length = e.TryGetProperty("length", out var len) && len.ValueKind == JsonValueKind.Number ? len.GetInt32() : 0,
                });
            }
        }
        return entities;
    }

    private static string? ExtractErrorCode(JsonElement raw)
    {
        if (raw.ValueKind != JsonValueKind.Object) return null;
        if (raw.TryGetProperty("error", out var err) && err.ValueKind == JsonValueKind.Object &&
            err.TryGetProperty("code", out var code))
        {
            return code.GetString();
        }
        return null;
    }

    private static string? ExtractErrorMessage(JsonElement raw)
    {
        if (raw.ValueKind != JsonValueKind.Object) return null;
        if (raw.TryGetProperty("error", out var err) && err.ValueKind == JsonValueKind.Object &&
            err.TryGetProperty("message", out var msg))
        {
            return msg.GetString();
        }
        return null;
    }
}

/// <summary>Container for everything one PII call returns.</summary>
public sealed record AzureLanguageResult(
    JsonElement RawRequest,
    JsonElement RawResponse,
    List<EntityDto> Entities,
    long LatencyMs);

/// <summary>Surfaced when an upstream Azure call fails. The proxy wraps this as a <see cref="ProxyError"/>.</summary>
public sealed class UpstreamException : Exception
{
    public string ErrorCode { get; }
    public int Status { get; }
    public JsonElement Raw { get; }
    public int? RetryAfterSeconds { get; }

    public UpstreamException(string errorCode, string message, int status, JsonElement raw, int? retryAfter)
        : base(message)
    {
        ErrorCode = errorCode;
        Status = status;
        Raw = raw;
        RetryAfterSeconds = retryAfter;
    }
}
