import { makeStyles, tokens } from '@fluentui/react-components';
import { useMemo } from 'react';
import { getCategoryMeta } from '../constants/piiCategories';
import type { EntityDto } from '../lib/types';
import { isRtlLanguage } from '../constants/supportedLanguages';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  pane: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '16px',
    overflow: 'auto',
    minHeight: '240px',
    maxHeight: '60vh',
  },
  paneTitle: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  paneText: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
  },
  legend: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  legendItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: tokens.fontSizeBase200,
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  highlight: {
    padding: '0 1px',
    borderRadius: '3px',
    borderBottom: '2px solid currentColor',
  },
});

interface SideBySideViewProps {
  originalText: string;
  redactedText: string;
  entities: EntityDto[];
  language: string;
}

/**
 * Two-pane view: original text on the left with coloured entity highlights
 * (hover tooltips include category/subcategory/confidence/offset/length);
 * redacted text on the right verbatim as the proxy returned it. Switches
 * panes to RTL automatically when the language is right-to-left.
 */
export function SideBySideView({ originalText, redactedText, entities, language }: SideBySideViewProps) {
  const styles = useStyles();
  const dir = isRtlLanguage(language) ? 'rtl' : 'ltr';

  const distinctCategories = useMemo(() => {
    const set = new Set<string>();
    for (const e of entities) set.add(e.category);
    return Array.from(set);
  }, [entities]);

  return (
    <div>
      <div className={styles.legend} aria-label="Entity legend">
        {distinctCategories.length === 0 ? (
          <span style={{ color: tokens.colorNeutralForeground3 }}>No entities detected yet.</span>
        ) : (
          distinctCategories.map((c) => {
            const m = getCategoryMeta(c);
            return (
              <span key={c} className={styles.legendItem}>
                <span className={styles.dot} style={{ backgroundColor: m.color }} />
                {c}
              </span>
            );
          })
        )}
      </div>
      <div className={styles.root}>
        <div className={styles.pane} dir={dir}>
          <div className={styles.paneTitle}>Original</div>
          <div className={styles.paneText}>{renderHighlighted(originalText, entities)}</div>
        </div>
        <div className={styles.pane} dir={dir}>
          <div className={styles.paneTitle}>Redacted</div>
          <div className={styles.paneText}>{redactedText || <em>Run "Detect &amp; Redact" to populate.</em>}</div>
        </div>
      </div>
    </div>
  );
}

function renderHighlighted(text: string, entities: EntityDto[]) {
  if (!text) return <em>Empty</em>;
  if (entities.length === 0) return text;
  const sorted = [...entities].sort((a, b) => a.offset - b.offset);
  const out: (string | JSX.Element)[] = [];
  let cursor = 0;
  sorted.forEach((e, i) => {
    if (e.offset > cursor) out.push(text.slice(cursor, e.offset));
    const meta = getCategoryMeta(e.category);
    const span = text.slice(e.offset, e.offset + e.length);
    out.push(
      <mark
        key={`${e.offset}-${i}`}
        title={`${e.category}${e.subcategory ? ` · ${e.subcategory}` : ''} · confidence ${e.confidenceScore.toFixed(2)} · offset ${e.offset} · length ${e.length}`}
        style={{
          backgroundColor: meta.color + '33',
          color: 'inherit',
          borderBottom: `2px solid ${meta.color}`,
          padding: '0 1px',
          borderRadius: '3px',
        }}
      >
        {span}
      </mark>
    );
    cursor = e.offset + e.length;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}
