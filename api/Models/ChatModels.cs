using System.Text.Json;
using System.Text.Json.Serialization;

namespace PiiStudio.Api.Models;

/// <summary>Inbound LLM request from the SPA.</summary>
public sealed class ChatRequest
{
    /// <summary>System prompt for the chat completion (editable in the UI).</summary>
    [JsonPropertyName("systemPrompt")]
    public string SystemPrompt { get; set; } = string.Empty;

    /// <summary>User content — should already be the <em>redacted</em> text.</summary>
    [JsonPropertyName("userText")]
    public string UserText { get; set; } = string.Empty;

    /// <summary>Optional tokenization map. Required if <see cref="Rehydrate"/> is true.</summary>
    [JsonPropertyName("mapping")]
    public List<MappingEntry> Mapping { get; set; } = new();

    /// <summary>When true, the proxy rehydrates tokens in the LLM response back to original values.</summary>
    [JsonPropertyName("rehydrate")]
    public bool Rehydrate { get; set; } = true;

    /// <summary>Sampling temperature (0–2). Default 0.2 for deterministic-ish summaries.</summary>
    [JsonPropertyName("temperature")]
    public double Temperature { get; set; } = 0.2;

    /// <summary>Maximum tokens to generate.</summary>
    [JsonPropertyName("maxTokens")]
    public int MaxTokens { get; set; } = 800;
}

/// <summary>Response returned by <c>POST /api/llm/chat</c>.</summary>
public sealed class ChatResponse
{
    [JsonPropertyName("llmMessage")]
    public string LlmMessage { get; set; } = string.Empty;

    /// <summary>The same message with token placeholders restored to original values.</summary>
    [JsonPropertyName("rehydratedMessage")]
    public string RehydratedMessage { get; set; } = string.Empty;

    /// <summary>Tokens the proxy expected to find in the LLM message but did not.</summary>
    [JsonPropertyName("tokensNotFound")]
    public List<string> TokensNotFound { get; set; } = new();

    [JsonPropertyName("rawRequest")]
    public JsonElement RawRequest { get; set; }

    [JsonPropertyName("rawResponse")]
    public JsonElement RawResponse { get; set; }

    [JsonPropertyName("latencyMs")]
    public long LatencyMs { get; set; }

    [JsonPropertyName("audit")]
    public AuditEntry Audit { get; set; } = new();
}
