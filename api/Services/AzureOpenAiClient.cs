using System.Diagnostics;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using PiiStudio.Api.Models;

namespace PiiStudio.Api.Services;

/// <summary>
/// Thin client for Azure OpenAI Chat Completions. Returns raw request and
/// response bodies plus the assistant message string so the SPA can render
/// the full trace.
/// </summary>
public sealed class AzureOpenAiClient
{
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    private readonly IHttpClientFactory _httpFactory;

    public AzureOpenAiClient(IHttpClientFactory httpFactory)
    {
        _httpFactory = httpFactory;
    }

    /// <summary>
    /// Calls Azure OpenAI Chat Completions and returns the raw bodies, the
    /// assistant message, and end-to-end latency in milliseconds.
    /// </summary>
    /// <param name="endpoint">Azure OpenAI resource endpoint base URL.</param>
    /// <param name="key">Azure OpenAI resource key (sent as <c>api-key</c>).</param>
    /// <param name="deployment">Chat deployment name (e.g. <c>gpt-4o</c>).</param>
    /// <param name="apiVersion">REST API version (e.g. <c>2024-10-21</c>).</param>
    /// <param name="request">The proxy chat request.</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    public async Task<OpenAiResult> ChatAsync(
        string endpoint,
        string key,
        string deployment,
        string apiVersion,
        ChatRequest request,
        CancellationToken cancellationToken)
    {
        var url = $"{endpoint.TrimEnd('/')}/openai/deployments/{Uri.EscapeDataString(deployment)}/chat/completions?api-version={Uri.EscapeDataString(apiVersion)}";

        var body = new Dictionary<string, object?>
        {
            ["messages"] = new[]
            {
                new { role = "system", content = request.SystemPrompt },
                new { role = "user", content = request.UserText }
            },
            ["temperature"] = request.Temperature,
            ["max_tokens"] = request.MaxTokens
        };
        var requestJson = JsonSerializer.Serialize(body, JsonOpts);

        using var http = _httpFactory.CreateClient("azure-openai");
        using var message = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = new StringContent(requestJson, Encoding.UTF8, "application/json")
        };
        message.Headers.Add("api-key", key);

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
                $"Network error calling Azure OpenAI: {ex.Message}",
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

        var assistantMessage = ExtractAssistantMessage(rawResponseElement);
        return new OpenAiResult(rawRequestElement, rawResponseElement, assistantMessage, sw.ElapsedMilliseconds);
    }

    /// <summary>
    /// Rehydrates the LLM response by replacing tokens with original values.
    /// Tokens are replaced in length-descending order so prefix collisions
    /// (e.g. <c>[PERSON_1]</c> vs <c>[PERSON_10]</c>) are handled correctly.
    /// </summary>
    /// <param name="message">The LLM message that may contain tokens.</param>
    /// <param name="mapping">Tokenisation map returned earlier from <c>/api/pii/analyze</c>.</param>
    /// <returns>A tuple of the rehydrated message and the list of tokens we expected but didn't find.</returns>
    public (string rehydrated, List<string> notFound) Rehydrate(string message, IEnumerable<MappingEntry> mapping)
    {
        var rehydrated = message;
        var notFound = new List<string>();
        foreach (var entry in mapping.OrderByDescending(m => m.Token.Length))
        {
            if (rehydrated.Contains(entry.Token, StringComparison.Ordinal))
            {
                rehydrated = rehydrated.Replace(entry.Token, entry.OriginalValue, StringComparison.Ordinal);
            }
            else
            {
                notFound.Add(entry.Token);
            }
        }
        return (rehydrated, notFound);
    }

    private static string ExtractAssistantMessage(JsonElement raw)
    {
        if (raw.ValueKind != JsonValueKind.Object) return string.Empty;
        if (!raw.TryGetProperty("choices", out var choices) || choices.ValueKind != JsonValueKind.Array) return string.Empty;
        foreach (var choice in choices.EnumerateArray())
        {
            if (!choice.TryGetProperty("message", out var msg)) continue;
            if (!msg.TryGetProperty("content", out var content)) continue;
            return content.GetString() ?? string.Empty;
        }
        return string.Empty;
    }

    private static string? ExtractErrorCode(JsonElement raw)
    {
        if (raw.ValueKind != JsonValueKind.Object) return null;
        if (raw.TryGetProperty("error", out var err) && err.ValueKind == JsonValueKind.Object &&
            err.TryGetProperty("code", out var code))
        {
            return code.ValueKind == JsonValueKind.String ? code.GetString() : code.ToString();
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

/// <summary>Container for everything one chat call returns.</summary>
public sealed record OpenAiResult(
    JsonElement RawRequest,
    JsonElement RawResponse,
    string AssistantMessage,
    long LatencyMs);
