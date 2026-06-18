import { makeStyles, tokens } from '@fluentui/react-components';

interface ConfidenceBarProps {
  /** Score 0-1. */
  value: number;
}

const useStyles = makeStyles({
  wrap: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  track: {
    position: 'relative',
    width: '60px',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: tokens.colorNeutralBackground5,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    transition: 'width 200ms ease',
  },
  text: {
    fontVariantNumeric: 'tabular-nums',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    minWidth: '32px',
  },
});

function colorFor(v: number): string {
  if (v >= 0.85) return '#107C10';
  if (v >= 0.6) return '#0078D4';
  if (v >= 0.4) return '#FFB900';
  return '#D13438';
}

/**
 * Horizontal confidence indicator with a numeric value to its right.
 * Green ≥ 0.85, blue ≥ 0.6, amber ≥ 0.4, red below.
 */
export function ConfidenceBar({ value }: ConfidenceBarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const styles = useStyles();
  return (
    <span className={styles.wrap} aria-label={`Confidence ${value.toFixed(2)}`}>
      <span className={styles.track}>
        <span className={styles.fill} style={{ width: `${pct}%`, backgroundColor: colorFor(value) }} />
      </span>
      <span className={styles.text}>{value.toFixed(2)}</span>
    </span>
  );
}
