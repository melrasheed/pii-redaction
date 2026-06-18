import { makeStyles, tokens } from '@fluentui/react-components';
import { getCategoryMeta } from '../constants/piiCategories';

interface EntityChipProps {
  category: string;
  /** When true, show "(Preview)" suffix on the label. */
  showPreviewBadge?: boolean;
  /** Optional count to append in parens, e.g. "Person · 4". */
  count?: number;
}

const useStyles = makeStyles({
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '2px 10px',
    borderRadius: tokens.borderRadiusCircular,
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: '#fff',
    whiteSpace: 'nowrap',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  preview: {
    fontWeight: tokens.fontWeightRegular,
    opacity: 0.85,
    fontSize: tokens.fontSizeBase100,
    marginLeft: '4px',
  },
});

/**
 * Small coloured pill summarising a PII category. Uses the category's
 * canonical brand colour from `piiCategories.ts`.
 */
export function EntityChip({ category, showPreviewBadge, count }: EntityChipProps) {
  const meta = getCategoryMeta(category);
  const styles = useStyles();
  return (
    <span className={styles.chip} style={{ backgroundColor: meta.color }} title={meta.tooltip}>
      <span className={styles.dot} />
      {meta.category}
      {typeof count === 'number' ? ` · ${count}` : null}
      {showPreviewBadge && meta.isPreview ? <span className={styles.preview}>preview</span> : null}
    </span>
  );
}
