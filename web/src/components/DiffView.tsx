import { makeStyles, tokens } from '@fluentui/react-components';
import { useMemo } from 'react';
import type { EntityDto } from '../lib/types';

const useStyles = makeStyles({
  pane: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '16px',
    overflow: 'auto',
    minHeight: '240px',
    maxHeight: '60vh',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
  },
  remove: {
    color: '#A4262C',
    textDecoration: 'line-through',
    backgroundColor: '#FDE7E9',
    padding: '0 2px',
    borderRadius: '2px',
  },
  add: {
    color: '#107C10',
    backgroundColor: '#DFF6DD',
    padding: '0 2px',
    borderRadius: '2px',
    marginLeft: '2px',
  },
});

interface DiffViewProps {
  originalText: string;
  redactedText: string;
  entities: EntityDto[];
}

/**
 * Character-aligned diff: each entity span is shown as the original
 * value in red strikethrough immediately followed by what the redacted
 * text used in its place (the token, mask string, or asterisks). The
 * algorithm walks entities in offset order so reading order matches.
 */
export function DiffView({ originalText, redactedText, entities }: DiffViewProps) {
  const styles = useStyles();
  const parts = useMemo(() => buildDiff(originalText, redactedText, entities), [originalText, redactedText, entities]);

  return (
    <div className={styles.pane}>
      {parts.length === 0 ? <em>Run "Detect &amp; Redact" to view diff.</em> : null}
      {parts.map((p, i) => {
        if (p.kind === 'same') return <span key={i}>{p.text}</span>;
        return (
          <span key={i}>
            <span className={styles.remove}>{p.original}</span>
            <span className={styles.add}>{p.redacted}</span>
          </span>
        );
      })}
    </div>
  );
}

type DiffPart =
  | { kind: 'same'; text: string }
  | { kind: 'change'; original: string; redacted: string };

/**
 * Walks both texts side-by-side, using entity offsets in the *original*
 * to know where to switch from "same" segments to "change" segments.
 * The replacement text in the redacted output is whatever lies at the
 * matching offset in `redactedText`, computed by tracking the running
 * delta between original and redacted indices.
 */
function buildDiff(originalText: string, redactedText: string, entities: EntityDto[]): DiffPart[] {
  if (!originalText) return [];
  if (entities.length === 0) return [{ kind: 'same', text: originalText }];
  const sorted = [...entities].sort((a, b) => a.offset - b.offset);
  const out: DiffPart[] = [];
  let origCursor = 0;
  let redCursor = 0;
  for (const e of sorted) {
    if (e.offset > origCursor) {
      const sliceLen = e.offset - origCursor;
      const sameText = originalText.slice(origCursor, e.offset);
      out.push({ kind: 'same', text: sameText });
      origCursor += sliceLen;
      redCursor += sliceLen;
    }
    const orig = originalText.slice(e.offset, e.offset + e.length);
    // Find the replacement span in redactedText. Since policies may insert
    // strings of different lengths than the entity, scan forward to next "same"
    // anchor — the character immediately after the entity in the original.
    const nextOrigChar = originalText[e.offset + e.length] ?? '';
    let replacement = '';
    if (nextOrigChar) {
      const next = redactedText.indexOf(nextOrigChar, redCursor);
      replacement = next >= 0 ? redactedText.slice(redCursor, next) : redactedText.slice(redCursor);
      redCursor = next >= 0 ? next : redactedText.length;
    } else {
      replacement = redactedText.slice(redCursor);
      redCursor = redactedText.length;
    }
    out.push({ kind: 'change', original: orig, redacted: replacement });
    origCursor = e.offset + e.length;
  }
  if (origCursor < originalText.length) {
    out.push({ kind: 'same', text: originalText.slice(origCursor) });
  }
  return out;
}
