import { useMemo, useState } from 'react';
import {
  Body1Strong,
  Button,
  Caption1,
  Dropdown,
  Input,
  Option,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { ArrowDownload24Regular, Filter24Regular } from '@fluentui/react-icons';
import { ConfidenceBar } from './ConfidenceBar';
import { EntityChip } from './EntityChip';
import type { EntityDto } from '../lib/types';

interface EntitiesTableProps {
  entities: EntityDto[];
}

const useStyles = makeStyles({
  toolbar: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' },
  toolbarRow2: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' },
  scrollWrap: { flex: 1, overflowY: 'auto', minHeight: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '10px 12px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
    borderRightColor: tokens.colorNeutralStroke2,
    borderBottomColor: tokens.colorNeutralStroke2,
    borderLeftColor: tokens.colorNeutralStroke2,
    borderRadius: tokens.borderRadiusMedium,
  },
  cardText: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase300,
    wordBreak: 'break-word',
    lineHeight: tokens.lineHeightBase300,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    fontFamily: tokens.fontFamilyMonospace,
  },
  empty: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200, padding: '12px 0' },
  containerCol: { display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 },
});

type SortKey = 'offset' | 'category' | 'confidenceScore' | 'text';
const sortLabels: { value: SortKey; label: string }[] = [
  { value: 'offset', label: 'Position in text' },
  { value: 'category', label: 'Category' },
  { value: 'confidenceScore', label: 'Confidence' },
  { value: 'text', label: 'Text (A→Z)' },
];

/** Card-list view of detected entities — fits comfortably in the 400px right rail. */
export function EntitiesTable({ entities }: EntitiesTableProps) {
  const styles = useStyles();
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('offset');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? entities.filter(
          (e) =>
            e.text.toLowerCase().includes(q) ||
            e.category.toLowerCase().includes(q) ||
            (e.subcategory ?? '').toLowerCase().includes(q)
        )
      : entities;
    const sorted = [...list].sort((a, b) => {
      let av: number | string = a[sortKey] as number | string;
      let bv: number | string = b[sortKey] as number | string;
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      // Confidence default desc, others asc.
      const dir = sortKey === 'confidenceScore' ? -1 : 1;
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    return sorted;
  }, [entities, query, sortKey]);

  const exportCsv = () => {
    const rows = [
      ['text', 'category', 'subcategory', 'confidence', 'offset', 'length'],
      ...filtered.map((e) => [e.text, e.category, e.subcategory ?? '', e.confidenceScore, e.offset, e.length]),
    ];
    const csv = rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pii-entities-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.containerCol}>
      <div className={styles.toolbar}>
        <Filter24Regular />
        <Input
          value={query}
          onChange={(_, d) => setQuery(d.value)}
          placeholder="Filter text or category"
          style={{ flex: 1 }}
        />
      </div>
      <div className={styles.toolbarRow2}>
        <Caption1>Sort by:</Caption1>
        <Dropdown
          size="small"
          value={sortLabels.find((s) => s.value === sortKey)?.label ?? ''}
          selectedOptions={[sortKey]}
          onOptionSelect={(_, d) => setSortKey((d.optionValue as SortKey) ?? 'offset')}
          style={{ flex: 1, minWidth: 0 }}
        >
          {sortLabels.map((s) => (
            <Option key={s.value} value={s.value}>{s.label}</Option>
          ))}
        </Dropdown>
        <Button size="small" icon={<ArrowDownload24Regular />} onClick={exportCsv} disabled={entities.length === 0}>
          CSV
        </Button>
      </div>
      <div className={styles.scrollWrap}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            {entities.length === 0 ? 'Run "Detect & Redact" to populate.' : 'No matches.'}
          </div>
        ) : (
          <div className={styles.list}>
            {filtered.map((e, i) => (
              <div key={`${e.offset}-${i}`} className={styles.card}>
                <div className={styles.cardText}>
                  <Body1Strong>{e.text}</Body1Strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <EntityChip category={e.category} showPreviewBadge />
                  <ConfidenceBar value={e.confidenceScore} />
                </div>
                <div className={styles.metaRow}>
                  <span>offset {e.offset}</span>
                  <span>·</span>
                  <span>length {e.length}</span>
                  {e.subcategory ? (
                    <>
                      <span>·</span>
                      <span>sub {e.subcategory}</span>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
