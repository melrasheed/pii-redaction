import {
  Body1Strong,
  Button,
  Caption1,
  Tag,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { ArrowDownload24Regular, ArrowRightRegular } from '@fluentui/react-icons';
import { EntityChip } from './EntityChip';
import type { MappingEntry } from '../lib/types';

interface MappingTableProps {
  mapping: MappingEntry[];
}

const useStyles = makeStyles({
  containerCol: { display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
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
  tokenRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  arrow: { color: tokens.colorNeutralForeground3 },
  original: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase300,
    wordBreak: 'break-word',
    lineHeight: tokens.lineHeightBase300,
    paddingLeft: '4px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  empty: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200, padding: '12px 0' },
});

/** Card-list view of token → original mappings. Fits the 400px right rail. */
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
    <div className={styles.containerCol}>
      <div className={styles.toolbar}>
        <Caption1>
          {mapping.length} token{mapping.length === 1 ? '' : 's'}
        </Caption1>
        <Button size="small" icon={<ArrowDownload24Regular />} onClick={exportCsv} disabled={mapping.length === 0}>
          CSV
        </Button>
      </div>
      <div className={styles.scrollWrap}>
        {mapping.length === 0 ? (
          <div className={styles.empty}>
            The Tokenisation Map populates when the redaction policy is{' '}
            <code>entityMaskWithNumericSuffix</code>.
          </div>
        ) : (
          <div className={styles.list}>
            {mapping.map((m) => (
              <div key={m.token} className={styles.card}>
                <div className={styles.tokenRow}>
                  <Tag appearance="brand" shape="rounded" size="small">{m.token}</Tag>
                  <ArrowRightRegular className={styles.arrow} />
                </div>
                <div className={styles.original}>
                  <Body1Strong>{m.originalValue}</Body1Strong>
                </div>
                <div className={styles.metaRow}>
                  <EntityChip category={m.category} />
                  <span>·</span>
                  <span>{m.occurrences.length} occurrence{m.occurrences.length === 1 ? '' : 's'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
