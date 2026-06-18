import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Dropdown,
  Field,
  Input,
  Option,
  Switch,
  makeStyles,
  tokens,
  Tooltip,
  Body1,
  Caption1,
  Divider,
  Slider,
  Textarea,
} from '@fluentui/react-components';
import { Dismiss24Regular, Info16Regular } from '@fluentui/react-icons';
import toast from 'react-hot-toast';
import { useSettingsStore } from '../state/settingsStore';
import { MaskedSecretField } from './MaskedSecretField';
import { SectionHeader } from './SectionHeader';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const useStyles = makeStyles({
  body: { padding: '0 4px 24px 4px' },
  row: { display: 'flex', gap: '12px', alignItems: 'flex-end' },
  group: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' },
  actions: { display: 'flex', gap: '8px', marginTop: '8px' },
});

function tip(text: string) {
  return (
    <Tooltip content={text} relationship="description" withArrow>
      <Info16Regular style={{ color: tokens.colorNeutralForeground3, marginLeft: 4 }} />
    </Tooltip>
  );
}

/**
 * Multi-section settings drawer. Persisted to sessionStorage via the
 * `settingsStore`. Includes import/export of the whole config as JSON
 * (handy for repeat demos) and a full reset.
 */
export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const styles = useStyles();
  const language = useSettingsStore((s) => s.language);
  const openAi = useSettingsStore((s) => s.openAi);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const setOpenAi = useSettingsStore((s) => s.setOpenAi);
  const reset = useSettingsStore((s) => s.reset);
  const importJson = useSettingsStore((s) => s.importJson);
  const exportJson = useSettingsStore((s) => s.exportJson);

  const containerHelp =
    'Container mode just swaps the endpoint URL (e.g. http://localhost:5000). The Azure container exposes the same /language/:analyze-text route — no code changes needed. Use for sovereignty / airgap scenarios.';

  const handleExport = () => {
    const json = exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pii-studio-settings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return;
      try {
        importJson(await f.text());
        toast.success('Settings imported');
      } catch {
        toast.error('Invalid settings file');
      }
    };
    input.click();
  };

  return (
    <Drawer open={open} onOpenChange={(_, d) => !d.open && onClose()} position="end" size="medium">
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button appearance="subtle" aria-label="Close" icon={<Dismiss24Regular />} onClick={onClose} />
          }
        >
          Settings
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody className={styles.body}>
        {/* ── Azure AI Language ───────────────────────────── */}
        <section className={styles.group}>
          <SectionHeader title="Azure AI Language" description="Endpoint, key, API version, and deployment mode." />
          <Field label={<>Endpoint URL {tip('Base URL of your Azure AI Language resource, e.g. https://my-lang.cognitiveservices.azure.com')}</>}>
            <Input
              value={language.endpoint}
              placeholder="https://<resource>.cognitiveservices.azure.com"
              onChange={(_, d) => setLanguage({ endpoint: d.value })}
            />
          </Field>
          <Field label={<>API key {tip('Found in the Azure portal → your Language resource → Keys and Endpoint.')}</>}>
            <MaskedSecretField
              ariaLabel="Azure Language key"
              value={language.key}
              onChange={(v) => setLanguage({ key: v })}
              placeholder="Paste key 1 or key 2"
            />
          </Field>
          <div className={styles.row}>
            <Field label={<>API version {tip('REST API version sent to Azure. GA is recommended for production credibility.')}</>} style={{ flex: 1 }}>
              <Dropdown
                value={language.apiVersion}
                selectedOptions={[language.apiVersion]}
                onOptionSelect={(_, d) => setLanguage({ apiVersion: d.optionValue as typeof language.apiVersion })}
              >
                <Option value="2026-05-01">2026-05-01 (GA)</Option>
                <Option value="2026-05-15-preview">2026-05-15-preview</Option>
                <Option value="2025-11-15-preview">2025-11-15-preview</Option>
              </Dropdown>
            </Field>
            <Field label={<>Deployment mode {tip(containerHelp)}</>} style={{ flex: 1 }}>
              <Dropdown
                value={language.mode}
                selectedOptions={[language.mode]}
                onOptionSelect={(_, d) => setLanguage({ mode: (d.optionValue as 'cloud' | 'container') ?? 'cloud' })}
              >
                <Option value="cloud">Cloud (Azure)</Option>
                <Option value="container">Container (on-prem)</Option>
              </Dropdown>
            </Field>
          </div>
          <Caption1>{containerHelp}</Caption1>
        </section>

        <Divider />

        {/* ── Azure OpenAI ────────────────────────────────── */}
        <section className={styles.group}>
          <SectionHeader title="Azure OpenAI" description="Used for the Safe GenAI round-trip (redacted text → LLM → detokenised reply)." />
          <Field label={<>Endpoint URL {tip('Base URL of your Azure OpenAI resource, e.g. https://my-aoai.openai.azure.com')}</>}>
            <Input
              value={openAi.endpoint}
              placeholder="https://<resource>.openai.azure.com"
              onChange={(_, d) => setOpenAi({ endpoint: d.value })}
            />
          </Field>
          <Field label={<>API key {tip('Found in Azure portal → your Azure OpenAI resource → Keys and Endpoint.')}</>}>
            <MaskedSecretField
              ariaLabel="Azure OpenAI key"
              value={openAi.key}
              onChange={(v) => setOpenAi({ key: v })}
              placeholder="Paste key 1 or key 2"
            />
          </Field>
          <div className={styles.row}>
            <Field label="Deployment name" style={{ flex: 1 }}>
              <Input
                value={openAi.deployment}
                placeholder="e.g. gpt-4o"
                onChange={(_, d) => setOpenAi({ deployment: d.value })}
              />
            </Field>
            <Field label="API version" style={{ flex: 1 }}>
              <Input
                value={openAi.apiVersion}
                placeholder="2024-10-21"
                onChange={(_, d) => setOpenAi({ apiVersion: d.value })}
              />
            </Field>
          </div>
          <Field label="Model name (display only)">
            <Input value={openAi.modelName} onChange={(_, d) => setOpenAi({ modelName: d.value })} />
          </Field>
          <div className={styles.row}>
            <Field label="Max tokens" style={{ flex: 1 }}>
              <Input
                type="number"
                value={String(openAi.maxTokens)}
                onChange={(_, d) => setOpenAi({ maxTokens: Number(d.value || 0) })}
              />
            </Field>
            <Field label={`Temperature: ${openAi.temperature.toFixed(2)}`} style={{ flex: 1 }}>
              <Slider
                min={0}
                max={2}
                step={0.1}
                value={openAi.temperature}
                onChange={(_, d) => setOpenAi({ temperature: d.value })}
              />
            </Field>
          </div>
          <Field label={<>Default system prompt {tip('Sent as the LLM system message. Keep token placeholders verbatim for rehydration.')}</>}>
            <Textarea
              value={openAi.systemPrompt}
              onChange={(_, d) => setOpenAi({ systemPrompt: d.value })}
              rows={4}
            />
          </Field>
        </section>

        <Divider />

        {/* ── PII Defaults notice ────────────────────────────── */}
        <section className={styles.group}>
          <SectionHeader
            title="PII defaults"
            description="The per-request configuration card on the workbench is the live source. This drawer just shows where the defaults live."
          />
          <Body1>
            The per-request configuration card above the editor is bound to the same store. Adjust knobs there to change
            what each detection call sends to Azure.
          </Body1>
        </section>

        <Divider />

        {/* ── Import / Export / Reset ────────────────────────── */}
        <section className={styles.group}>
          <SectionHeader title="Configuration management" />
          <div className={styles.actions}>
            <Button appearance="primary" onClick={handleExport}>
              Export JSON
            </Button>
            <Button onClick={handleImport}>Import JSON</Button>
            <Button
              appearance="subtle"
              onClick={() => {
                reset();
                toast.success('Settings reset to defaults');
              }}
            >
              Reset to defaults
            </Button>
          </div>
          <Caption1>
            Settings live only in this browser tab's sessionStorage. They are forwarded to the local .NET proxy per
            request via headers — the proxy never persists them.
          </Caption1>
        </section>

        {/* keep a switch for accessibility */}
        <Switch hidden checked />
      </DrawerBody>
    </Drawer>
  );
}
