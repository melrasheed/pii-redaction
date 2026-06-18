namespace PiiStudio.Api.Endpoints;

/// <summary>Health-check route used by the SPA bootstrap and by smoke tests.</summary>
public static class HealthEndpoints
{
    /// <summary>Maps <c>GET /api/health</c>.</summary>
    public static void MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/health", () => Results.Ok(new
        {
            ok = true,
            service = "pii-studio-api",
            version = typeof(HealthEndpoints).Assembly.GetName().Version?.ToString() ?? "dev",
            timestamp = DateTimeOffset.UtcNow
        }));
    }
}
