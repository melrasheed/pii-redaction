import { useMemo, useState } from 'react';
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
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
  scrollWrap: { maxHeight: '320px', overflow: 'auto' },
  cellMono: { fontFamily: tokens.fontFamilyMonospace, fontSize: tokens.fontSizeBase200 },
  empty: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200, padding: '12px 0' },
});

type SortKey = 'text' | 'category' | 'confidenceScore' | 'offset';

/** Sortable, filterable entity table with CSV export. */
export function EntitiesTable({ entities }: EntitiesTableProps) {
  const styles = useStyles();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'offset', dir: 'asc' });

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
      let av: number | string = a[sort.key] as number | string;
      let bv: number | string = b[sort.key] as number | string;
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sort.dir === 'asc' ? -1 : 1;
      if (av > bv) return sort.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [entities, query, sort]);

  const toggleSort = (key: SortKey) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  };

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
    <div>
      <div className={styles.toolbar}>
        <Filter24Regular />
        <Input
          value={query}
          onChange={(_, d) => setQuery(d.value)}
          placeholder="Filter by text or category"
          style={{ flex: 1 }}
        />
        <Button icon={<ArrowDownload24Regular />} onClick={exportCsv} disabled={entities.length === 0}>
          CSV
        </Button>
      </div>
      <div className={styles.scrollWrap}>
        <Table size="small" aria-label="Entities">
          <TableHeader>
            <TableRow>
              <TableHeaderCell onClick={() => toggleSort('text')} style={{ cursor: 'pointer' }}>Text</TableHeaderCell>
              <TableHeaderCell onClick={() => toggleSort('category')} style={{ cursor: 'pointer' }}>Category</TableHeaderCell>
              <TableHeaderCell>Sub</TableHeaderCell>
              <TableHeaderCell onClick={() => toggleSort('confidenceScore')} style={{ cursor: 'pointer' }}>Confidence</TableHeaderCell>
              <TableHeaderCell onClick={() => toggleSort('offset')} style={{ cursor: 'pointer' }}>Offset</TableHeaderCell>
              <TableHeaderCell>Len</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className={styles.empty}>{entities.length === 0 ? 'Run "Detect & Redact" to populate this table.' : 'No matches.'}</div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((e, i) => (
                <TableRow key={`${e.offset}-${i}`}>
                  <TableCell className={styles.cellMono}>{e.text}</TableCell>
                  <TableCell><EntityChip category={e.category} showPreviewBadge /></TableCell>
                  <TableCell className={styles.cellMono}>{e.subcategory ?? '—'}</TableCell>
                  <TableCell><ConfidenceBar value={e.confidenceScore} /></TableCell>
                  <TableCell className={styles.cellMono}>{e.offset}</TableCell>
                  <TableCell className={styles.cellMono}>{e.length}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
