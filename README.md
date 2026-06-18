# Azure AI Language — PII Redaction Studio

> Executive-grade local demo of Azure AI Language **Text PII detection & redaction** with the **Safe GenAI** (tokenize → LLM → detokenize) pattern. Built for Qatar BFSI/Telco technical architects.

![Screenshot placeholder — main workbench](docs/screenshots/01-workbench.png)

## What this demo shows

- The **full surface** of Azure AI Language Text PII — every config knob exposed in the UI (entity filters, domain, model version, redaction policy, language, excluded entities/values, synonyms, min-confidence, logging opt-out, API version, string index type).
- **Side-by-side** original-vs-redacted text with colored entity highlights.
- A live **tokenization map** (token ↔ original value) — session-only, in-memory.
- **Safe GenAI round-trip**: redacted text is sent to Azure OpenAI, then the response is rehydrated locally so the LLM never sees raw PII.
- A browser-visible **request trace** (method, URL, masked key, body, status, latency) for every PII and LLM call.
- An **audit log** of every action (timestamp, action, entity counts, latency, outcome).
- A rich **template gallery** of long-form bilingual (English + Arabic) samples across Banking, Telecom, Healthcare, Legal/HR, Customer Support, and Government with authentic Qatari context.

## Architecture

```
┌──────────────────────────┐    HTTPS    ┌──────────────────────────┐
│  React 18 + Vite + TS    │   :5080     │  .NET 8 Minimal API      │
│  Fluent UI v9            │ ──────────► │  /api/pii/analyze        │
│  (browser :5173)         │             │  /api/llm/chat           │
│                          │             │  /api/health             │
│  Settings in             │             │                          │
│  sessionStorage          │             │  Header overrides:       │
└──────────────────────────┘             │  X-Azure-Language-*      │
                                         │  X-AOAI-*                │
                                         └────────────┬─────────────┘
                                                      │
                                  ┌───────────────────┼───────────────────┐
                                  ▼                                       ▼
                  Azure AI Language (Text PII)              Azure OpenAI (Chat Completions)
```

The .NET proxy exists so API keys never end up in the SPA bundle. Per-request header overrides (`X-Azure-Language-Endpoint`, `X-Azure-Language-Key`, `X-AOAI-*`) let the UI fully control where requests go — including a one-click swap to a local **Azure AI Language container** endpoint for sovereignty/airgap scenarios.

## Prerequisites

- **.NET 8 SDK or newer** — <https://dotnet.microsoft.com/download/dotnet/8.0>
- **Node.js 20 or newer** — <https://nodejs.org/>
- **Windows PowerShell 5.1** or **PowerShell 7+**
- An **Azure AI Language** resource (key + endpoint)
- An **Azure OpenAI** resource (key + endpoint + chat deployment, e.g. `gpt-4o`)

## Setup (one command)

```powershell
./start.ps1
```

This will:

1. Verify `dotnet` ≥ 8 and `node` ≥ 20
2. `dotnet restore` in `/api`
3. `npm install` in `/web` (only if `node_modules` is missing)
4. Start the .NET API on <http://localhost:5080>
5. Start the Vite dev server on <http://localhost:5173>
6. Open your default browser

To stop everything:

```powershell
./stop.ps1
```

## Where to enter your keys

Click the **⚙ Settings** gear in the top-right and fill in:

- **Azure AI Language** → Endpoint + Key + API version (`2026-05-01` GA default) + deployment mode (Cloud / Container)
- **Azure OpenAI** → Endpoint + Key + Deployment name + API version (`2024-10-21` default)

Settings are stored in your browser's **`sessionStorage`** (cleared when you close the tab). They are forwarded **per-request** to the local .NET proxy via headers; the proxy never persists them.

You can **Export** your settings as JSON for repeat demos and **Import** them back next time.

## Keyboard shortcuts

| Shortcut       | Action                                  |
| -------------- | --------------------------------------- |
| `Ctrl + Enter` | Detect & Redact PII                     |
| `Ctrl + L`     | Send redacted text to LLM + Detokenize |
| `Ctrl + ,`     | Open Settings drawer                    |

## Project layout

```
/api                  .NET 8 Minimal API
  /Models             Request/Response DTOs
  /Services           AzureLanguageClient, AzureOpenAiClient, TokenizationService
  /Endpoints          PiiEndpoints, ChatEndpoints, HealthEndpoints
/web                  React + Vite + TS frontend
  /src
    /components       SettingsDrawer, TemplateGallery, TextEditor, ...
    /constants        supportedLanguages.ts, piiCategories.ts
    /hooks            usePiiAnalyze, useChat, useAuditLog, useKeyboardShortcuts
    /lib              apiClient, types, validators
    /state            Zustand stores (settings/trace/audit/mapping)
    /templates        Industry samples (English + Arabic)
start.ps1             Launch everything
stop.ps1              Stop everything
README.md             This file
DEMO-SCRIPT.md        10-min architect-audience talk track
RUN.md                Exact launch + smoke-test steps
```

## Troubleshooting

- **`Missing closing '}' in statement block` from `./start.ps1`** -- you are on Windows PowerShell 5.1 and the script file has non-ASCII characters that get misread. The scripts shipped in this repo are pure ASCII to avoid this; if you've manually edited them and re-introduced Unicode, either save the file as UTF-8-with-BOM or switch to PowerShell 7 (`winget install Microsoft.PowerShell`).

- **`dotnet: command not found`** → install the .NET 8 SDK (see prereqs).
- **`node: command not found`** → install Node 20+ (see prereqs).
- **Browser opens to a Vite "loading" screen forever** → the API hasn't started yet. Check the API PowerShell window for errors (likely a port-5080 conflict or missing `appsettings.json`).
- **401 Unauthorized from Azure AI Language** → key or endpoint typo in the Settings drawer. Verify in the Azure portal under your Language resource → *Keys and Endpoint*.
- **429 from Azure AI Language** → free-tier rate limit. The MessageBar surfaces the `Retry-After` header.
- **CORS error in browser DevTools** → the API only allows `http://localhost:5173`. If you opened the SPA on a different port, edit `api/Program.cs`.
- **Arabic text shows left-to-right** → confirm the language picker is set to `ar` (the editor and side-by-side panes flip to RTL on Arabic/Hebrew/Farsi/Urdu).
- **`entityMaskWithNumericSuffix` does nothing** → that policy is implemented as a server-side post-pass over the GA `noMask` response in `TokenizationService.cs`. Make sure your API version dropdown is set to a value the Language resource supports.

## Security notes

- **No production telemetry.** This is a local-only demo.
- **No keys are persisted on disk** by the .NET proxy. Keys live in browser `sessionStorage` and are forwarded per-request via headers.
- The **`loggingOptOut=true`** query parameter is forwarded to Azure so Microsoft does not log request content during the demo — a credibility booster for regulated banking demos.
- The proxy locks **CORS** to `http://localhost:5173`. Do not expose the API to a non-localhost interface without re-locking CORS.

## License

Microsoft sample demo content — for customer demonstration only. Not for production use.
