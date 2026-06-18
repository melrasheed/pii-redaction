import { useState } from 'react';
import { Button, makeStyles, tokens, Body1Strong } from '@fluentui/react-components';
import { Copy24Regular, ChevronDown16Regular, ChevronRight16Regular } from '@fluentui/react-icons';
import toast from 'react-hot-toast';

interface RawJsonViewProps {
  request: unknown;
  response: unknown;
}

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: '12px' },
  section: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '12px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  pre: {
    margin: 0,
    marginTop: '8px',
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke3}`,
    borderRadius: tokens.borderRadiusSmall,
    padding: '8px 12px',
    overflow: 'auto',
    maxHeight: '420px',
    fontSize: tokens.fontSizeBase200,
    fontFamily: tokens.fontFamilyMonospace,
    whiteSpace: 'pre',
  },
});

function copy(value: string) {
  navigator.clipboard.writeText(value).then(
    () => toast.success('Copied'),
    () => toast.error('Copy failed')
  );
}

function Section({ title, payload }: { title: string; payload: unknown }) {
  const styles = useStyles();
  const [open, setOpen] = useState(true);
  const json = JSON.stringify(payload ?? null, null, 2);
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <Button
          appearance="transparent"
          icon={open ? <ChevronDown16Regular /> : <ChevronRight16Regular />}
          onClick={() => setOpen(!open)}
        >
          <Body1Strong>{title}</Body1Strong>
        </Button>
        <Button size="small" icon={<Copy24Regular />} onClick={() => copy(json)}>
          Copy
        </Button>
      </div>
      {open ? <pre className={styles.pre}>{json}</pre> : null}
    </div>
  );
}

/** Collapsible raw JSON viewer for the request the proxy sent to Azure and the response it got back. */
export function RawJsonView({ request, response }: RawJsonViewProps) {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Section title="Request to Azure" payload={request} />
      <Section title="Response from Azure" payload={response} />
    </div>
  );
}
