import {
  Button,
  Caption1,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
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
import { ArrowDownload24Regular, Delete24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import toast from 'react-hot-toast';
import { useAuditStore } from '../state/auditStore';

interface AuditLogDrawerProps {
  open: boolean;
  onClose: () => void;
}

const useStyles = makeStyles({
  toolbar: { display: 'flex', gap: '6px' },
  mono: { fontFamily: tokens.fontFamilyMonospace, fontSize: tokens.fontSizeBase200 },
});

/** Right-side audit log drawer. JSON export, clear, sessionStorage-backed. */
export function AuditLogDrawer({ open, onClose }: AuditLogDrawerProps) {
  const styles = useStyles();
  const entries = useAuditStore((s) => s.entries);
  const clear = useAuditStore((s) => s.clear);
  const exportJson = useAuditStore((s) => s.exportJson);

  const download = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pii-studio-audit-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Audit log exported');
  };

  return (
    <Drawer open={open} onOpenChange={(_, d) => !d.open && onClose()} position="end" size="medium">
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <div className={styles.toolbar}>
              <Button appearance="subtle" icon={<ArrowDownload24Regular />} onClick={download} disabled={entries.length === 0}>
                Export
              </Button>
              <Button appearance="subtle" icon={<Delete24Regular />} onClick={() => { clear(); toast('Audit cleared'); }}>
                Clear
              </Button>
              <Button appearance="subtle" aria-label="Close" icon={<Dismiss24Regular />} onClick={onClose} />
            </div>
          }
        >
          Audit log
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        {entries.length === 0 ? (
          <Caption1>No actions recorded yet.</Caption1>
        ) : (
          <Table size="small" aria-label="Audit log">
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Time</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
                <TableHeaderCell>Details</TableHeaderCell>
                <TableHeaderCell>Entities</TableHeaderCell>
                <TableHeaderCell>Latency</TableHeaderCell>
                <TableHeaderCell>Outcome</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className={styles.mono}>{new Date(e.timestamp).toLocaleTimeString()}</TableCell>
                  <TableCell><Tag size="extra-small">{e.action}</Tag></TableCell>
                  <TableCell className={styles.mono} title={e.details}>{e.details}</TableCell>
                  <TableCell>{e.entityCount || '—'}</TableCell>
                  <TableCell className={styles.mono}>{e.latencyMs} ms</TableCell>
                  <TableCell>
                    {e.success ? <Tag color="success" size="extra-small">ok</Tag> : <Tag color="danger" size="extra-small">{e.error?.slice(0, 40) ?? 'error'}</Tag>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DrawerBody>
    </Drawer>
  );
}
