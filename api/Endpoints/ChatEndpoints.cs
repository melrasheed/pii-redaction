using System.Diagnostics;
using System.Text.Json;
using PiiStudio.Api.Models;
using PiiStudio.Api.Services;

namespace PiiStudio.Api.Endpoints;

/// <summary>Maps the <c>/api/llm/*</c> routes.</summary>
public static class ChatEndpoints
{
    /// <summary>Registers chat routes on the given <see cref="IEndpointRouteBuilder"/>.</summary>
    public static void MapChatEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/llm/chat", ChatAsync);
    }

    private static async Task<IResult> ChatAsync(
        HttpContext http,
        ChatRequest request,
        AzureOpenAiClient client,
        ILogger<AzureOpenAiClient> logger,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.UserText))
        {
            return Results.BadRequest(new ProxyError
            {
                ErrorCode = "InvalidRequest",
                Message = "Field 'userText' is required.",
                Status = 400,
                Raw = JsonDocument.Parse("\"\"").RootElement
            });
        }

        var endpoint = http.Request.Headers[ProxyHeaders.OpenAiEndpoint].ToString();
        var key = http.Request.Headers[ProxyHeaders.OpenAiKey].ToString();
        var deployment = http.Request.Headers[ProxyHeaders.OpenAiDeployment].ToString();
        var apiVersion = http.Request.Headers[ProxyHeaders.OpenAiApiVersion].ToString();

        if (string.IsNullOrWhiteSpace(endpoint) || string.IsNullOrWhiteSpace(key) ||
            string.IsNullOrWhiteSpace(deployment) || string.IsNullOrWhiteSpace(apiVersion))
        {
            return Results.BadRequest(new ProxyError
            {
                ErrorCode = "MissingConfig",
                Message = $"Headers '{ProxyHeaders.OpenAiEndpoint}', '{ProxyHeaders.OpenAiKey}', '{ProxyHeaders.OpenAiDeployment}', and '{ProxyHeaders.OpenAiApiVersion}' are required.",
                Status = 400,
                Raw = JsonDocument.Parse("\"\"").RootElement
            });
        }

        var sw = Stopwatch.StartNew();
        var audit = new AuditEntry
        {
            Action = "llm.chat",
            Details = $"deployment={deployment}, api={apiVersion}, rehydrate={request.Rehydrate}"
        };

        try
        {
            var result = await client.ChatAsync(endpoint, key, deployment, apiVersion, request, ct);
            sw.Stop();

            string rehydrated = result.AssistantMessage;
            var notFound = new List<string>();
            if (request.Rehydrate && request.Mapping.Count > 0)
            {
                (rehydrated, notFound) = client.Rehydrate(result.AssistantMessage, request.Mapping);
            }

            audit.LatencyMs = sw.ElapsedMilliseconds;
            audit.Success = true;

            return Results.Ok(new ChatResponse
            {
                LlmMessage = result.AssistantMessage,
                RehydratedMessage = rehydrated,
                TokensNotFound = notFound,
                RawRequest = result.RawRequest,
                RawResponse = result.RawResponse,
                LatencyMs = sw.ElapsedMilliseconds,
                Audit = audit
            });
        }
        catch (UpstreamException ex)
        {
            sw.Stop();
            audit.LatencyMs = sw.ElapsedMilliseconds;
            audit.Success = false;
            audit.Error = ex.Message;
            logger.LogWarning("Upstream LLM error: {Code} {Message}", ex.ErrorCode, ex.Message);
            return Results.Json(new ProxyError
            {
                ErrorCode = ex.ErrorCode,
                Message = ex.Message,
                Status = ex.Status,
                Raw = ex.Raw,
                RetryAfterSeconds = ex.RetryAfterSeconds
            }, statusCode: ex.Status > 0 ? ex.Status : 502);
        }
    }
}
