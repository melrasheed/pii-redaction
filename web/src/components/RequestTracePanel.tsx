import { useState } from 'react';
import {
  Body1Strong,
  Button,
  Caption1,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  TabList,
  Tab,
  Tag,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Dismiss24Regular, Copy24Regular, Delete24Regular } from '@fluentui/react-icons';
import toast from 'react-hot-toast';
import { useTraceStore } from '../state/traceStore';
import type { TraceEntry } from '../lib/types';

interface RequestTracePanelProps {
  open: boolean;
  onClose: () => void;
  /** When provided, scope the trace list to one kind only. */
  scope?: 'pii' | 'llm' | 'all';
}

const useStyles = makeStyles({
  filters: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '16px' },
  card: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
  },
  meta: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  url: { fontFamily: tokens.fontFamilyMonospace, fontSize: tokens.fontSizeBase200, wordBreak: 'break-all' },
  pre: {
    margin: 0,
    padding: '8px 12px',
    backgroundColor: tokens.colorNeutralBackground3,
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase100,
    maxHeight: '200px',
    overflow: 'auto',
    whiteSpace: 'pre',
  },
  blockLabel: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    padding: '6px 12px 0',
  },
  toolbar: { display: 'flex', gap: '6px' },
});

function copy(value: string, label: string) {
  navigator.clipboard.writeText(value).then(
    () => toast.success(`${label} copied`),
    () => toast.error('Copy failed')
  );
}

function asCurl(t: TraceEntry): string {
  const headers = Object.entries(t.requestHeaders)
    .map(([k, v]) => ` -H "${k}: ${v}"`)
    .join(' \\\n');
  const body = t.requestBody ? ` -d '${JSON.stringify(t.requestBody)}'` : '';
  return `curl -X ${t.method} "${t.url}" \\\n${headers}${body}`;
}

function statusColor(status: number): 'brand' | 'success' | 'warning' | 'danger' | 'informative' {
  if (status === 0) return 'informative';
  if (status >= 500) return 'danger';
  if (status >= 400) return 'warning';
  if (status >= 200) return 'success';
  return 'brand';
}

/**
 * Bottom-of-page drawer listing every HTTP call (PII + LLM) with masked
 * headers, formatted bodies, status, latency, and a Copy-as-cURL button.
 * Used by architects to verify exactly what travelled over the wire.
 */
export function RequestTracePanel({ open, onClose, scope = 'all' }: RequestTracePanelProps) {
  const styles = useStyles();
  const entries = useTraceStore((s) => s.entries);
  const clear = useTraceStore((s) => s.clear);
  const [filter, setFilter] = useState<'all' | 'pii' | 'llm'>(scope);

  const filtered = entries.filter((e) => filter === 'all' || e.kind === filter);

  return (
    <Drawer open={open} onOpenChange={(_, d) => !d.open && onClose()} position="bottom" size="large">
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <div className={styles.toolbar}>
              <Button appearance="subtle" icon={<Delete24Regular />} onClick={() => { clear(); toast('Trace cleared'); }}>
                Clear
              </Button>
              <Button appearance="subtle" aria-label="Close" icon={<Dismiss24Regular />} onClick={onClose} />
            </div>
          }
        >
          Request trace
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        <div className={styles.filters}>
          <Caption1>Filter:</Caption1>
          <TabList selectedValue={filter} onTabSelect={(_, d) => setFilter(d.value as typeof filter)} size="small">
            <Tab value="all">All ({entries.length})</Tab>
            <Tab value="pii">PII ({entries.filter((e) => e.kind === 'pii').length})</Tab>
            <Tab value="llm">LLM ({entries.filter((e) => e.kind === 'llm').length})</Tab>
          </TabList>
        </div>
        <div className={styles.list}>
          {filtered.length === 0 ? (
            <Caption1>No requests yet.</Caption1>
          ) : (
            filtered.map((t) => (
              <div key={t.id} className={styles.card}>
                <div className={styles.header}>
                  <div className={styles.meta}>
                    <Tag appearance="brand" size="extra-small">{t.kind.toUpperCase()}</Tag>
                    <Tag appearance="filled" size="extra-small">{t.method}</Tag>
                    <Tag appearance="filled" size="extra-small" color={statusColor(t.status)}>{t.status || 'ERR'}</Tag>
                    <Caption1>{t.latencyMs} ms · {new Date(t.timestamp).toLocaleTimeString()}</Caption1>
                  </div>
                  <Button size="small" icon={<Copy24Regular />} onClick={() => copy(asCurl(t), 'cURL')}>
                    Copy as cURL
                  </Button>
                </div>
                <div className={styles.url} style={{ padding: '6px 12px' }}>
                  <Body1Strong>{t.url}</Body1Strong>
                </div>
                <div className={styles.blockLabel}>Request headers (sensitive masked)</div>
                <pre className={styles.pre}>{JSON.stringify(t.requestHeaders, null, 2)}</pre>
                <div className={styles.blockLabel}>Request body</div>
                <pre className={styles.pre}>{JSON.stringify(t.requestBody ?? null, null, 2)}</pre>
                <div className={styles.blockLabel}>Response body</div>
                <pre className={styles.pre}>{JSON.stringify(t.responseBody ?? null, null, 2)}</pre>
                {t.error ? <div style={{ padding: '6px 12px', color: '#A4262C' }}>Error: {t.error}</div> : null}
              </div>
            ))
          )}
        </div>
      </DrawerBody>
    </Drawer>
  );
}
