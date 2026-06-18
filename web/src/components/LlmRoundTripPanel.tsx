import { useState, type MutableRefObject } from 'react';
import {
  Body1Strong,
  Button,
  Card,
  CardHeader,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Tag,
  Textarea,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Send24Regular, BotRegular } from '@fluentui/react-icons';
import { useChat } from '../hooks/useChat';
import { useMappingStore } from '../state/mappingStore';
import { useSettingsStore } from '../state/settingsStore';
import type { ChatResponse } from '../lib/types';

interface LlmRoundTripPanelProps {
  /** External trigger handle so the workbench's "Send Redacted → LLM" button can use the same flow. */
  triggerRef?: MutableRefObject<(() => void) | null>;
}

const useStyles = makeStyles({
  card: { padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' },
  block: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: '80px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
  },
  blockLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
});

/**
 * The Safe GenAI round-trip card. Sends the *redacted* text to Azure OpenAI
 * together with the tokenisation map, then renders the LLM reply alongside
 * the rehydrated version so an architect audience can see the LLM never
 * touched the original PII.
 */
export function LlmRoundTripPanel({ triggerRef }: LlmRoundTripPanelProps) {
  const styles = useStyles();
  const redactedText = useMappingStore((s) => s.redactedText);
  const mapping = useMappingStore((s) => s.mapping);
  const systemPromptDefault = useSettingsStore((s) => s.openAi.systemPrompt);
  const temperature = useSettingsStore((s) => s.openAi.temperature);
  const maxTokens = useSettingsStore((s) => s.openAi.maxTokens);

  const [systemPrompt, setSystemPrompt] = useState(systemPromptDefault);
  const [result, setResult] = useState<ChatResponse | null>(null);
  const chat = useChat();

  const send = () => {
    if (!redactedText) return;
    chat.mutate(
      {
        systemPrompt,
        userText: redactedText,
        mapping,
        rehydrate: true,
        temperature,
        maxTokens,
      },
      {
        onSuccess: (r) => setResult(r),
      }
    );
  };

  if (triggerRef) {
    triggerRef.current = send;
  }

  const err = chat.error?.response?.data;

  return (
    <Card className={styles.card}>
      <CardHeader
        image={<BotRegular />}
        header={<Body1Strong>LLM round-trip — Safe GenAI</Body1Strong>}
        description={<span style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground2 }}>Redacted text → Azure OpenAI → detokenise locally.</span>}
        action={
          <Button
            appearance="primary"
            icon={chat.isPending ? <Spinner size="tiny" /> : <Send24Regular />}
            onClick={send}
            disabled={!redactedText || chat.isPending}
          >
            Send (Ctrl+L)
          </Button>
        }
      />
      <div>
        <div className={styles.blockLabel}>System prompt</div>
        <Textarea value={systemPrompt} onChange={(_, d) => setSystemPrompt(d.value)} rows={3} />
      </div>
      <div>
        <div className={styles.blockLabel}>User content sent to the LLM (redacted)</div>
        <div className={styles.block}>{redactedText || <em>Run "Detect &amp; Redact" first.</em>}</div>
      </div>
      {err ? (
        <MessageBar intent="error">
          <MessageBarBody>
            <MessageBarTitle>{err.errorCode}</MessageBarTitle> {err.message}
          </MessageBarBody>
        </MessageBar>
      ) : null}
      {result ? (
        <>
          <div>
            <div className={styles.blockLabel}>LLM reply (tokens only)</div>
            <div className={styles.block}>{result.llmMessage || <em>(empty)</em>}</div>
          </div>
          <div>
            <div className={styles.blockLabel}>Rehydrated reply (PII restored locally)</div>
            <div className={styles.block}>{result.rehydratedMessage || <em>(empty)</em>}</div>
          </div>
          {result.tokensNotFound.length > 0 ? (
            <MessageBar intent="warning">
              <MessageBarBody>
                <MessageBarTitle>Tokens not found in LLM reply</MessageBarTitle> The LLM didn't echo back {result.tokensNotFound.length}{' '}
                token(s). These were therefore not rehydrated:{' '}
                {result.tokensNotFound.map((t) => (
                  <Tag key={t} size="extra-small" style={{ marginRight: 4 }}>{t}</Tag>
                ))}
              </MessageBarBody>
            </MessageBar>
          ) : null}
          <span style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 }}>
            Latency: {result.latencyMs} ms
          </span>
        </>
      ) : null}
    </Card>
  );
}
