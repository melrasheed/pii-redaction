using System.Text.Json.Serialization;
using PiiStudio.Api.Endpoints;
using PiiStudio.Api.Services;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "Spa";

builder.Services.AddCors(o => o.AddPolicy(CorsPolicy, p =>
{
    var allowedOrigin = builder.Configuration["Cors:AllowedOrigin"] ?? "http://localhost:5173";
    p.WithOrigins(allowedOrigin)
     .AllowAnyHeader()
     .AllowAnyMethod()
     .WithExposedHeaders("Retry-After");
}));

builder.Services.ConfigureHttpJsonOptions(o =>
{
    o.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    o.SerializerOptions.PropertyNameCaseInsensitive = true;
});

builder.Services.AddHttpClient("azure-language", c =>
{
    c.Timeout = TimeSpan.FromSeconds(60);
});
builder.Services.AddHttpClient("azure-openai", c =>
{
    c.Timeout = TimeSpan.FromSeconds(120);
});

builder.Services.AddSingleton<TokenizationService>();
builder.Services.AddSingleton<AzureLanguageClient>();
builder.Services.AddSingleton<AzureOpenAiClient>();

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseCors(CorsPolicy);

app.MapHealthEndpoints();
app.MapPiiEndpoints();
app.MapChatEndpoints();

app.Run();
