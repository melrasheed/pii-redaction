import { useMemo, useRef } from 'react';
import {
  Button,
  Caption1,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Tab,
  TabList,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { useState } from 'react';
import { Sparkle24Regular, Send24Regular, BroomRegular } from '@fluentui/react-icons';
import toast from 'react-hot-toast';
import { ConfigCard } from './ConfigCard';
import { TextEditor } from './TextEditor';
import { SideBySideView } from './SideBySideView';
import { DiffView } from './DiffView';
import { RawJsonView } from './RawJsonView';
import { LlmRoundTripPanel } from './LlmRoundTripPanel';
import { useSettingsStore } from '../state/settingsStore';
import { useMappingStore } from '../state/mappingStore';
import { usePiiAnalyze } from '../hooks/usePiiAnalyze';
import { getCategoryMeta } from '../constants/piiCategories';

interface WorkbenchProps {
  /** Set by App so global keyboard shortcuts can invoke detect/sendLlm. */
  registerHandlers: (h: { detect: () => void; sendLlm: () => void }) => void;
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    paddingBottom: '48px',
    overflowY: 'auto',
    minHeight: 0,
  },
  actionRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  rawRequest: { display: 'flex', flexDirection: 'column', gap: '8px' },
  langRow: { display: 'flex', alignItems: 'center', gap: '8px' },
});

/** Centre workbench — config, editor, action bar, tabbed views, and LLM panel. */
export function Workbench({ registerHandlers }: WorkbenchProps) {
  const styles = useStyles();
  const piiDefaults = useSettingsStore((s) => s.piiDefaults);
  const language = piiDefaults.language;
  const apiVersion = piiDefaults.apiVersion;
  const languageEndpoint = useSettingsStore((s) => s.language.endpoint);
  const languageKey = useSettingsStore((s) => s.language.key);

  const originalFromStore = useMappingStore((s) => s.originalText);
  const editorText = useMappingStore((s) => s.editorText);
  const setEditorText = useMappingStore((s) => s.setEditorText);
  const redactedText = useMappingStore((s) => s.redactedText);
  const entities = useMappingStore((s) => s.entities);
  const resetMapping = useMappingStore((s) => s.reset);

  const [lastResponse, setLastResponse] = useState<{ rawRequest: unknown; rawResponse: unknown } | null>(null);
  const [tab, setTab] = useState<'side' | 'diff' | 'json'>('side');

  const llmSendRef = useRef<(() => void) | null>(null);
  const analyze = usePiiAnalyze();

  const highlights = useMemo(
    () => entities.map((e) => ({ offset: e.offset, length: e.length, category: e.category, color: getCategoryMeta(e.category).color })),
    [entities]
  );

  const runDetect = () => {
    if (!editorText.trim()) {
      toast.error('Enter some text first');
      return;
    }
    if (!languageEndpoint || !languageKey) {
      toast.error('Set Azure AI Language endpoint and key in Settings');
      return;
    }
    analyze.mutate(
      { ...piiDefaults, text: editorText },
      {
        onSuccess: (data) => {
          setLastResponse({ rawRequest: data.rawRequest, rawResponse: data.rawResponse });
          toast.success(`Detected ${data.entities.length} entities in ${data.latencyMs} ms`);
        },
        onError: () => {
          // Error UI is rendered below from analyze.error
        },
      }
    );
  };

  const sendLlm = () => {
    if (!redactedText) {
      toast.error('Run "Detect & Redact" first');
      return;
    }
    llmSendRef.current?.();
  };

  // Wire shortcuts at mount.
  if (registerHandlers) {
    registerHandlers({ detect: runDetect, sendLlm });
  }

  const err = analyze.error?.response?.data;
  const retryAfter = err?.retryAfterSeconds;

  return (
    <main className={styles.root} aria-label="Workbench">
      <ConfigCard />

      <div className={styles.langRow}>
        <Caption1>Editor language: <strong>{language}</strong> · API: {apiVersion} · Policy: <strong>{piiDefaults.redactionPolicy}</strong></Caption1>
      </div>

      <TextEditor value={editorText} onChange={setEditorText} language={language} highlights={highlights} />

      <div className={styles.actionRow}>
        <Button
          appearance="primary"
          icon={analyze.isPending ? <Spinner size="tiny" /> : <Sparkle24Regular />}
          onClick={runDetect}
          disabled={analyze.isPending}
        >
          Detect &amp; Redact (Ctrl+Enter)
        </Button>
        <Button appearance="secondary" icon={<Send24Regular />} onClick={sendLlm} disabled={!redactedText}>
          Send Redacted → LLM → Detokenize (Ctrl+L)
        </Button>
        <Button
          appearance="subtle"
          icon={<BroomRegular />}
          onClick={() => {
            resetMapping();
            setLastResponse(null);
            toast('Cleared');
          }}
        >
          Clear
        </Button>
      </div>

      {err ? (
        <MessageBar intent={err.status === 429 ? 'warning' : 'error'}>
          <MessageBarBody>
            <MessageBarTitle>{err.errorCode} · HTTP {err.status}</MessageBarTitle>
            {err.message}
            {typeof retryAfter === 'number' ? <> · Retry after {retryAfter}s</> : null}
            <details style={{ marginTop: 6 }}>
              <summary>Show raw response</summary>
              <pre style={{ marginTop: 4, fontSize: tokens.fontSizeBase200, maxHeight: 200, overflow: 'auto' }}>
                {JSON.stringify(err.raw ?? null, null, 2)}
              </pre>
            </details>
          </MessageBarBody>
        </MessageBar>
      ) : null}

      <div>
        <TabList selectedValue={tab} onTabSelect={(_, d) => setTab(d.value as 'side' | 'diff' | 'json')}>
          <Tab value="side">Side-by-Side</Tab>
          <Tab value="diff">Diff</Tab>
          <Tab value="json">Raw JSON</Tab>
        </TabList>
        <div style={{ marginTop: 12 }}>
          {tab === 'side' ? (
            <SideBySideView
              originalText={originalFromStore || editorText}
              redactedText={redactedText}
              entities={entities}
              language={language}
            />
          ) : null}
          {tab === 'diff' ? (
            <DiffView originalText={originalFromStore || editorText} redactedText={redactedText} entities={entities} />
          ) : null}
          {tab === 'json' ? (
            <RawJsonView request={lastResponse?.rawRequest} response={lastResponse?.rawResponse} />
          ) : null}
        </div>
      </div>

      <LlmRoundTripPanel triggerRef={llmSendRef} />
    </main>
  );
}
