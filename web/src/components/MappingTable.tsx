import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Tag,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { ArrowDownload24Regular } from '@fluentui/react-icons';
import { EntityChip } from './EntityChip';
import type { MappingEntry } from '../lib/types';

interface MappingTableProps {
  mapping: MappingEntry[];
}

const useStyles = makeStyles({
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  scrollWrap: { maxHeight: '300px', overflow: 'auto' },
  cellMono: { fontFamily: tokens.fontFamilyMonospace, fontSize: tokens.fontSizeBase200 },
  empty: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200, padding: '12px 0' },
});

/** Token ↔ original value reverse-lookup table. Populated for the entityMaskWithNumericSuffix policy. */
export function MappingTable({ mapping }: MappingTableProps) {
  const styles = useStyles();

  const exportCsv = () => {
    const rows = [
      ['token', 'originalValue', 'category', 'subCategory', 'confidence', 'occurrences'],
      ...mapping.map((m) => [m.token, m.originalValue, m.category, m.subCategory ?? '', m.confidence, m.occurrences.join('|')]),
    ];
    const csv = rows.map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pii-mapping-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <span style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground2 }}>
          {mapping.length} token{mapping.length === 1 ? '' : 's'}
        </span>
        <Button size="small" icon={<ArrowDownload24Regular />} onClick={exportCsv} disabled={mapping.length === 0}>
          CSV
        </Button>
      </div>
      <div className={styles.scrollWrap}>
        <Table size="small" aria-label="Tokenisation map">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Token</TableHeaderCell>
              <TableHeaderCell>Original</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Occurrences</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mapping.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <div className={styles.empty}>
                    The Tokenisation Map populates when the redaction policy is{' '}
                    <code>entityMaskWithNumericSuffix</code>.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              mapping.map((m) => (
                <TableRow key={m.token}>
                  <TableCell className={styles.cellMono}><Tag appearance="brand" shape="rounded">{m.token}</Tag></TableCell>
                  <TableCell className={styles.cellMono}>{m.originalValue}</TableCell>
                  <TableCell><EntityChip category={m.category} /></TableCell>
                  <TableCell className={styles.cellMono}>{m.occurrences.length}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
