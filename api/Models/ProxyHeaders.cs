namespace PiiStudio.Api.Models;

/// <summary>
/// Header names used to override the proxy's per-request Azure configuration.
/// The UI forwards endpoint/key/deployment via these headers so the SPA can
/// fully control configuration without baking secrets into the bundle.
/// </summary>
public static class ProxyHeaders
{
    /// <summary>Azure AI Language endpoint base URL, e.g. <c>https://my-lang.cognitiveservices.azure.com</c>.</summary>
    public const string LanguageEndpoint = "X-Azure-Language-Endpoint";

    /// <summary>Azure AI Language resource key (forwarded as <c>Ocp-Apim-Subscription-Key</c>).</summary>
    public const string LanguageKey = "X-Azure-Language-Key";

    /// <summary>Azure OpenAI endpoint base URL, e.g. <c>https://my-aoai.openai.azure.com</c>.</summary>
    public const string OpenAiEndpoint = "X-AOAI-Endpoint";

    /// <summary>Azure OpenAI resource key (forwarded as <c>api-key</c>).</summary>
    public const string OpenAiKey = "X-AOAI-Key";

    /// <summary>Azure OpenAI chat deployment name, e.g. <c>gpt-4o</c>.</summary>
    public const string OpenAiDeployment = "X-AOAI-Deployment";

    /// <summary>Azure OpenAI REST API version, e.g. <c>2024-10-21</c>.</summary>
    public const string OpenAiApiVersion = "X-AOAI-ApiVersion";
}
