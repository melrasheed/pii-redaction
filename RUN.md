# RUN.md — Launch and smoke-test guide

This file complements `README.md` with the *exact* commands to bring the demo up and verify each piece works.

## Prerequisites (one-time)

| Tool        | Minimum  | Verify with         |
| ----------- | -------- | ------------------- |
| PowerShell  | 5.1 or 7 | `$PSVersionTable`   |
| .NET SDK    | 8.x      | `dotnet --version`  |
| Node.js     | 20.x     | `node -v`           |
| npm         | 10.x     | `npm -v`            |
| Browser     | Edge / Chrome / Firefox latest | — |

## Azure resources (one-time)

You need **two** Azure resources for the live demo. Have the following four values ready before you click *Detect*:

| Source                  | Value                                                                 |
| ----------------------- | --------------------------------------------------------------------- |
| **Azure AI Language**   | Endpoint URL (e.g. `https://my-lang.cognitiveservices.azure.com`)     |
| Azure AI Language       | Key 1 *or* Key 2                                                      |
| **Azure OpenAI**        | Endpoint URL (e.g. `https://my-aoai.openai.azure.com`)                |
| Azure OpenAI            | Key 1 *or* Key 2 + Chat deployment name (e.g. `gpt-4o`)               |

Grab them in the Azure portal under each resource → *Keys and Endpoint* (and *Model deployments* for Azure OpenAI).

## Launch

```powershell
cd C:\path\to\pii-redaction
./start.ps1
```

You should see:

```
==> Verifying prerequisites
    dotnet <X.Y.Z> ✓
    node v<X.Y.Z> ✓
==> Restoring backend (dotnet)
    dotnet restore complete ✓
==> Installing frontend dependencies (npm)
    node_modules present — skipping install
    frontend deps ready ✓
==> Starting services
    API window PID: ...
    Web window PID: ...
==> Waiting for frontend to come up
    Frontend ready at http://localhost:5173 ✓
==> Demo launched
    API:      http://localhost:5080  (window PID ...)
    Frontend: http://localhost:5173  (window PID ...)

    Stop with: ./stop.ps1
```

Two new PowerShell windows will open (one for the .NET API, one for Vite). Your default browser opens to <http://localhost:5173> automatically.

## Smoke tests

### 1. Backend is healthy

```powershell
curl http://localhost:5080/api/health
```

Expected: `{"ok":true,"service":"pii-studio-api","version":"...","timestamp":"..."}`

### 2. Frontend loads

Open <http://localhost:5173>. You should see the **AppBar** at the top, the **Template Gallery** on the left, an empty **editor** in the centre, and the **Insights** panel on the right.

### 3. Enter Azure credentials

1. Click the gear (top right) or press `Ctrl+,`.
2. Paste your **Azure AI Language** endpoint + key.
3. Paste your **Azure OpenAI** endpoint + key + deployment name.
4. Close the drawer.

### 4. Detect & redact

1. From the left rail click **Banking → English → KYC onboarding form — premium account**.
2. The editor populates with the long-form sample.
3. Press `Ctrl+Enter` (or click **Detect & Redact**).
4. Within ~1–3 seconds you should see:
   - A toast like *"Detected 32 entities in 412 ms"*.
   - The **Side-by-Side** tab populated with coloured highlights.
   - The **Insights** panel on the right populated with the **Entities** table.

### 5. Tokenise & inspect the mapping

1. In the **Per-request configuration** card change **redactionPolicy** to **entityMaskWithNumericSuffix**.
2. Re-run **Detect & Redact**.
3. The **Insights** panel: switch to **Tokenisation map** tab — you should see rows like `[PERSON_1] → Sara Hussain Al-Kuwari`.

### 6. Inspect the wire

1. Click **Open trace** (top of right rail) or **Show trace** (bottom-right).
2. Filter to **PII**, expand the most recent entry.
3. Confirm the URL ends with `?api-version=2026-05-01&loggingOptOut=true`.
4. Confirm `Ocp-Apim-Subscription-Key` appears as `***redacted***`.

### 7. Safe-GenAI round-trip

1. Scroll to the **LLM round-trip** card.
2. Press `Ctrl+L` (or click **Send**).
3. Within a few seconds you should see:
   - **LLM reply (tokens only)** — the model's text containing tokens.
   - **Rehydrated reply** — the same text with PII restored locally.
4. Open the trace drawer, filter to **LLM**, confirm the LLM request body contains only tokens (no real names).

### 8. Container endpoint switch

1. Settings drawer → **Azure AI Language** → **Deployment mode** = `Container (on-prem)`.
2. Change endpoint to e.g. `http://localhost:5000`.
3. Close drawer, run **Detect & Redact**.
4. The trace shows the request hitting the local URL. (It will fail unless you have the container running — that's expected; the point is to demonstrate the URL swap.)

### 9. Audit export

1. Click the history icon (top-right) to open the **Audit log** drawer.
2. Confirm at least two rows: a `pii.analyze` and a `llm.chat`.
3. Click **Export** — a JSON file downloads.

## Stop

```powershell
./stop.ps1
```

You should see:

```
==> Stopping demo services
    API : stopped child PID ... (dotnet)
    API : stopped window PID ...
    Web : stopped child PID ... (node)
    Web : stopped window PID ...

Done.
```

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| `./start.ps1` says *dotnet not found* | Install .NET 8 SDK from <https://dotnet.microsoft.com/download/dotnet/8.0> |
| `./start.ps1` says *node not found* | Install Node 20+ from <https://nodejs.org/> |
| Port 5080 already in use | Change in `start.ps1` (`--urls`) and `web/vite.config.ts` (`proxy.target`) |
| Port 5173 already in use | Change in `start.ps1` (`--port`) and `web/vite.config.ts` (`server.port`) |
| 401 from Azure AI Language | Re-paste Key 1 / Key 2 in Settings (no trailing spaces) |
| 429 from Azure AI Language | Free tier rate limit; MessageBar shows `Retry-After`. Wait, or upgrade tier. |
| Arabic text shows left-to-right | Confirm the **Language** dropdown is set to `ar` (the editor flips to RTL only when the per-request language is Arabic/Hebrew/Farsi/Urdu/Pashto/Sindhi). |
| No entities highlighted on side-by-side | Check the **Entities** table on the right rail — if it's empty the run returned zero. If non-empty but no highlights, refresh the page (browser stylesheet injection cache). |
| `npm install` fails behind a corporate proxy | Configure npm: `npm config set proxy http://...` then re-run `./start.ps1` |
