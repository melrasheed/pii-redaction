# Demo script — Azure AI Language PII Redaction Studio
**Audience**: Qatar BFSI / Telco technical architects · **Duration**: ~10 minutes · **Setup**: One PowerShell command (`./start.ps1`) and valid Azure AI Language + Azure OpenAI keys entered into the Settings drawer before the meeting.

> Before you go on stage: open the **Settings** drawer (gear icon), paste the **Azure AI Language** endpoint + key + API version, then the **Azure OpenAI** endpoint + key + deployment name, click **Export JSON**, and save the file on your laptop. If anything ever goes sideways during a demo, click **Import JSON** to restore everything in one click.

---

## 0:00 — Intro (≈ 1 min)
> "Every Qatari bank, telco, healthcare provider, and government entity faces the same wall when they try to use generative AI on customer data: the data is full of PII — QID numbers, IBANs starting with QA, +974 phone numbers, Qatari addresses — and the moment that data leaves the device for a cloud LLM, it's a regulatory event under QCB, QFC, and the Qatar Personal Data Privacy Law. The pattern Microsoft recommends is **detect → redact → call the LLM on tokens → rehydrate locally**, and Azure AI Language Text PII is the engine that makes step 1 and 2 production-grade. This studio gives you the entire surface area of that engine in one screen, in English and Arabic, so you can see exactly what to pitch to your regulator."

Point at the AppBar. Mention: local-only demo, no Docker, no telemetry, runs on the architect's own machine, keys live only in the browser tab's sessionStorage.

## 1:00 — Pick a Banking Arabic KYC sample (≈ 1.5 min)
1. Open the **Template Gallery** on the left.
2. Click the **Arabic** tab, expand **Banking**, choose **نموذج فتح حساب توفير**.
3. The Monaco editor flips to RTL automatically. Show how dense the sample is — QID, IBAN starting `QA`, +974 numbers, Qatari address, employer.
4. Click **Detect & Redact** (or press `Ctrl+Enter`).
5. Side-by-Side view appears: every PII span on the left gets a colour, the redacted text appears on the right. Hover one span to show the tooltip (category, confidence, offset, length).

> "Notice that the same engine that just understood English KYC handled Modern Standard Arabic in the same call — same REST contract, same key. The detection happens in Azure AI Language, the highlighting happens in the browser; the proxy in the middle is 200 lines of C# whose only job is to never let your API key reach the SPA bundle."

## 2:30 — Switch redaction policy to entityMaskWithNumericSuffix (≈ 1.5 min)
1. In the **Per-request configuration** card, set **redactionPolicy** to **entityMaskWithNumericSuffix**.
2. Click **Detect & Redact** again.
3. The redacted pane now shows tokens like `[PERSON_1]`, `[PHONENUMBER_2]`, `[INTERNATIONALBANKINGACCOUNTNUMBER_1]`.
4. Switch the right rail to the **Tokenisation map** tab — the reverse-lookup table appears.

> "`entityMaskWithNumericSuffix` is the variant that enables the safe-GenAI pattern. Notice that the *same person value* re-uses the *same token* — `Sara Al-Kuwari` is `[PERSON_1]` everywhere she appears, even though she's mentioned five times. That property is what makes the LLM's output deterministically rehydrate-able. This policy isn't in the GA API yet — the local proxy implements it as a deterministic post-pass over Azure's `noMask` response, so the demo works on every API version you choose in the dropdown."

## 4:00 — Open the browser request trace (≈ 1.5 min)
1. Click **Open trace** in the right rail header (or the bottom-right **Show trace** chip).
2. Expand the most recent **PII** request.
3. Point out the request URL: `https://<endpoint>/language/:analyze-text?api-version=2026-05-01&loggingOptOut=true`.
4. Highlight `loggingOptOut=true`.
5. Show the masked `Ocp-Apim-Subscription-Key: ***redacted***` header.
6. Click **Copy as cURL** — paste into a terminal if useful.

> "`loggingOptOut=true` is the credibility booster for QCB conversations: it tells Azure not to log request content on the Microsoft side. Combined with this proxy living entirely on the customer's network, you can credibly tell your CISO that *no* customer PII is at rest in any Microsoft data centre — Azure AI Language returns the entity offsets to you in memory and forgets the request."

## 5:30 — Send redacted text to Azure OpenAI (≈ 1.5 min)
1. Scroll to the **LLM round-trip** card under the workbench tabs.
2. Show the editable **System prompt** (default is a summariser).
3. Show the **User content sent to the LLM** block — confirm it contains *only* tokens, no real names.
4. Click **Send** (or press `Ctrl+L`).
5. The **LLM reply (tokens only)** block populates — the model speaks only in tokens.

> "Take a hard look at that user-content block. There's no person name, no QID, no IBAN. That's the *exact* content the LLM sees. If your security team ever audits what left your tenancy, this is what they'll find on the wire."

## 7:00 — Detokenize back (≈ 1 min)
1. Show the **Rehydrated reply** block right below — the same response with PII restored.
2. Open the trace drawer again, filter to **LLM**, show that the LLM request body contains only tokens.

> "Rehydration happens *in the browser* — the proxy does a length-descending string replace using the mapping table that never left this session. The LLM was a black box that never knew Sara Al-Kuwari existed."

## 8:00 — Toggle endpoint to Container (≈ 1 min)
1. Open **Settings** (gear / `Ctrl+,`).
2. In **Azure AI Language**, change **Deployment mode** to **Container (on-prem)**, change the endpoint to `http://localhost:5000` (or wherever your container would live).
3. Close the drawer.
4. Detect again. Show that the only thing that changed is the endpoint URL in the trace — the request body is identical.

> "Sovereignty story in one click. Microsoft ships the *exact* same `:analyze-text` route inside an OCI container you can run on your own AKS, on-prem Kubernetes, or even in an air-gapped data centre. From the SPA's perspective it's a URL swap — zero code change, zero retraining, identical behaviour."

## 9:00 — Audit log export & close (≈ 1 min)
1. Open the **Audit log** drawer (history icon top-right).
2. Show timestamped entries for every `pii.analyze` and `llm.chat` action, latency and entity counts.
3. Click **Export** — JSON file downloads.

> "Every interaction in this UI was captured: who ran what, when, against which endpoint, with how many entities and what latency. Export it as JSON, drop it into Sentinel or a SIEM, and you have a forensic trail your compliance team can defend. That's it — twelve files of C#, twenty-something files of TypeScript, zero new infrastructure. Questions?"

---

## Optional callouts
- **Container note**: The Azure AI Language container image (`mcr.microsoft.com/azure-cognitive-services/textanalytics/pii`) is GA. Use it inside a private AKS for sovereignty.
- **Multi-doc batches**: The same `:analyze-text` route supports `documents: [...]` arrays of up to 25 — the demo uses one document at a time for narrative clarity.
- **Cost talk**: The Azure AI Language Standard tier bills per 1k text records. PII detection counts as one record per ≤ 1k characters.
