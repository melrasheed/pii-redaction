using System.Diagnostics;
using System.Text.Json;
using PiiStudio.Api.Models;
using PiiStudio.Api.Services;

namespace PiiStudio.Api.Endpoints;

/// <summary>Maps the <c>/api/pii/*</c> routes.</summary>
public static class PiiEndpoints
{
    /// <summary>Registers PII routes on the given <see cref="IEndpointRouteBuilder"/>.</summary>
    public static void MapPiiEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/pii/analyze", AnalyzeAsync);
    }

    /// <summary>Handles <c>POST /api/pii/analyze</c>.</summary>
    private static async Task<IResult> AnalyzeAsync(
        HttpContext http,
        PiiAnalyzeRequest request,
        AzureLanguageClient client,
        TokenizationService tokenizer,
        ILogger<AzureLanguageClient> logger,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
        {
            return Results.BadRequest(new ProxyError
            {
                ErrorCode = "InvalidRequest",
                Message = "Field 'text' is required.",
                Status = 400,
                Raw = JsonDocument.Parse("\"\"").RootElement
            });
        }

        var endpoint = http.Request.Headers[ProxyHeaders.LanguageEndpoint].ToString();
        var key = http.Request.Headers[ProxyHeaders.LanguageKey].ToString();
        if (string.IsNullOrWhiteSpace(endpoint) || string.IsNullOrWhiteSpace(key))
        {
            return Results.BadRequest(new ProxyError
            {
                ErrorCode = "MissingConfig",
                Message = $"Headers '{ProxyHeaders.LanguageEndpoint}' and '{ProxyHeaders.LanguageKey}' are required.",
                Status = 400,
                Raw = JsonDocument.Parse("\"\"").RootElement
            });
        }

        var sw = Stopwatch.StartNew();
        var audit = new AuditEntry
        {
            Action = "pii.analyze",
            Details = $"lang={request.Language}, policy={request.RedactionPolicy}, api={request.ApiVersion}"
        };

        try
        {
            var azureResult = await client.AnalyzeAsync(endpoint, key, request, ct);
            var (redacted, mapping, entities) = tokenizer.Apply(request.Text, azureResult.Entities, request);
            sw.Stop();

            audit.LatencyMs = sw.ElapsedMilliseconds;
            audit.EntityCount = entities.Count;
            audit.Success = true;

            var response = new PiiAnalyzeResponse
            {
                OriginalText = request.Text,
                RedactedText = redacted,
                Entities = entities,
                Mapping = mapping,
                RawRequest = azureResult.RawRequest,
                RawResponse = azureResult.RawResponse,
                LatencyMs = sw.ElapsedMilliseconds,
                Audit = audit
            };
            return Results.Ok(response);
        }
        catch (UpstreamException ex)
        {
            sw.Stop();
            audit.LatencyMs = sw.ElapsedMilliseconds;
            audit.Success = false;
            audit.Error = ex.Message;
            logger.LogWarning("Upstream PII error: {Code} {Message}", ex.ErrorCode, ex.Message);
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
