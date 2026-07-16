# Custom regex rules for the Azure AI Language — Text PII container

This folder holds a **custom regex recognition file** that extends the prebuilt PII
detection with domain-specific entities. It is consumed **only** by the on-premises
**Text PII container** (it is *not* used by the cloud endpoint).

- **File:** [`regex-rules/qatar-pii.json`](./regex-rules/qatar-pii.json)
- **Adds two entity types:**
  | Rule name (returned category)          | What it detects                    | Pattern (\.NET)                 |
  | -------------------------------------- | ---------------------------------- | ------------------------------- |
  | `CE_QatarPersonalIdentificationNumber` | Qatar QID — 11 digits, starts 2/3  | `(?<!\d)[23]\d{10}(?!\d)`       |
  | `CE_QatarPassportNumber`               | Qatar passport — 8 numeric digits  | `(?<!\d)\d{8}(?!\d)`            |

  Both rules include English **and** Arabic context hints (`passport`/`جواز`,
  `QID`/`الرقم الشخصي`) that boost confidence when those terms appear near a match.

> Rule names must begin with `CE_`, be unique, and use only alphanumerics/underscores.
> Patterns follow the [.NET regular expression](https://learn.microsoft.com/dotnet/standard/base-types/regular-expressions) syntax.
> Reference: [Adapt PII to your domain](https://learn.microsoft.com/azure/ai-services/language-service/personally-identifiable-information/how-to/adapt-to-domain-pii).

## Run the container with the custom rules

Mount this folder into the container and point `UserRegexRuleFilePath` at the file:

```bash
docker run --rm -it -p 5000:5000 --memory 8g --cpus 1 \
  -v "$(pwd)/regex-rules:/rules" \
  mcr.microsoft.com/azure-cognitive-services/textanalytics/pii:{IMAGE_TAG} \
  Eula=accept \
  Billing={ENDPOINT_URI} \
  ApiKey={API_KEY} \
  UserRegexRuleFilePath=/rules/qatar-pii.json
```

On Windows PowerShell:

```powershell
docker run --rm -it -p 5000:5000 --memory 8g --cpus 1 `
  -v "${PWD}\regex-rules:/rules" `
  mcr.microsoft.com/azure-cognitive-services/textanalytics/pii:{IMAGE_TAG} `
  Eula=accept `
  Billing={ENDPOINT_URI} `
  ApiKey={API_KEY} `
  UserRegexRuleFilePath=/rules/qatar-pii.json
```

To log which rules loaded and why matches fired, add:

```
Logging:Console:LogLevel:Default=Debug
```

## Using it from this app

1. Start the container as above (it listens on `http://localhost:5000`).
2. In the app **Settings → Azure AI Language**, set **Deployment mode = Container (on-prem)**
   and **Endpoint URL = `http://localhost:5000`** (no API key is required in container mode).
3. Run **Detect & Redact**. Matches are returned with the categories
   `CE_QatarPersonalIdentificationNumber` and `CE_QatarPassportNumber`, which the UI
   renders with dedicated colors and tooltips (see `web/src/constants/piiCategories.ts`).

## Tuning notes

- The passport pattern (`\d{8}`) is intentionally generic; the `passport` / `جواز`
  context hints boost genuine matches. Unrelated 8-digit numbers may still match at the
  base `matchScore` (0.55) — filter them with the **Minimum confidence** control, or raise
  the threshold, if needed.
- `matchScore` and `boostingScore` are 0–1 and safe to adjust for your data.
