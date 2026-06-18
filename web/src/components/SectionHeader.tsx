import { ReactNode } from 'react';
import { Body1Strong, makeStyles, tokens } from '@fluentui/react-components';

interface SectionHeaderProps {
  title: string;
  description?: string;
  right?: ReactNode;
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '12px',
    paddingBottom: '4px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: '12px',
  },
  text: { display: 'flex', flexDirection: 'column', gap: '2px' },
  desc: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
});

/** Small section heading used throughout drawers and right-rail panels. */
export function SectionHeader({ title, description, right }: SectionHeaderProps) {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <div className={styles.text}>
        <Body1Strong>{title}</Body1Strong>
        {description ? <span className={styles.desc}>{description}</span> : null}
      </div>
      {right}
    </div>
  );
}
