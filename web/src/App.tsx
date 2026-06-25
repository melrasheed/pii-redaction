import { useMemo, useRef, useState } from 'react';
import { FluentProvider, Tab, TabList, makeStyles, tokens } from '@fluentui/react-components';
import { Toaster } from 'react-hot-toast';
import { AppBar } from './components/AppBar';
import { TemplateGallery } from './components/TemplateGallery';
import { Workbench } from './components/Workbench';
import { EntitiesTable } from './components/EntitiesTable';
import { MappingTable } from './components/MappingTable';
import { SettingsDrawer } from './components/SettingsDrawer';
import { AuditLogDrawer } from './components/AuditLogDrawer';
import { RequestTracePanel } from './components/RequestTracePanel';
import { useSettingsStore } from './state/settingsStore';
import { useMappingStore } from './state/mappingStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { lightTheme, darkTheme } from './styles/theme';
import { SectionHeader } from './components/SectionHeader';
import { Button } from '@fluentui/react-components';
import { CodeBlock24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  shell: {
    display: 'grid',
    gridTemplateRows: '1fr',
    height: 'calc(100vh - 56px)',
    backgroundColor: tokens.colorNeutralBackground3,
    minHeight: 0,
  },
  rightRail: {
    padding: '16px',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: tokens.colorNeutralStroke2,
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minHeight: 0,
    overflow: 'hidden',
  },
});

/** Application shell: AppBar + three-column layout + drawers. */
export default function App() {
  const styles = useStyles();
  const darkMode = useSettingsStore((s) => s.ui.darkMode);
  const setPiiDefaults = useSettingsStore((s) => s.setPiiDefaults);
  const mapping = useMappingStore((s) => s.mapping);
  const entities = useMappingStore((s) => s.entities);
  const setMapping = useMappingStore((s) => s.set);
  const setEditorText = useMappingStore((s) => s.setEditorText);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [traceOpen, setTraceOpen] = useState(false);
  const [rightTab, setRightTab] = useState<'entities' | 'mapping'>('entities');
  const [galleryCollapsed, setGalleryCollapsed] = useState(false);

  const handlersRef = useRef<{ detect: () => void; sendLlm: () => void } | null>(null);
  const registerHandlers = (h: { detect: () => void; sendLlm: () => void }) => {
    handlersRef.current = h;
  };

  useKeyboardShortcuts({
    onDetect: () => handlersRef.current?.detect(),
    onSendLlm: () => handlersRef.current?.sendLlm(),
    onOpenSettings: () => setSettingsOpen(true),
  });

  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  return (
    <FluentProvider theme={theme} style={{ minHeight: '100vh' }}>
      <AppBar onOpenSettings={() => setSettingsOpen(true)} onOpenAudit={() => setAuditOpen(true)} />
      <div
        className={styles.shell}
        style={{ gridTemplateColumns: `${galleryCollapsed ? 40 : 320}px 1fr 400px` }}
      >
        <TemplateGallery
          collapsed={galleryCollapsed}
          onToggleCollapse={() => setGalleryCollapsed((v) => !v)}
          onPick={(s) => {
            setPiiDefaults({ language: s.language });
            setMapping({ originalText: s.text, redactedText: '', entities: [], mapping: [] });
            setEditorText(s.text);
          }}
        />
        <Workbench registerHandlers={registerHandlers} />
        <aside className={styles.rightRail} aria-label="Insights">
          <SectionHeader title="Insights" description="Live results from the latest detection run." right={
            <Button appearance="subtle" icon={<CodeBlock24Regular />} onClick={() => setTraceOpen(true)}>
              Open trace
            </Button>
          } />
          <TabList selectedValue={rightTab} onTabSelect={(_, d) => setRightTab(d.value as 'entities' | 'mapping')}>
            <Tab value="entities">Entities ({entities.length})</Tab>
            <Tab value="mapping">Tokenisation map ({mapping.length})</Tab>
          </TabList>
          {rightTab === 'entities' ? <EntitiesTable entities={entities} /> : <MappingTable mapping={mapping} />}
        </aside>
      </div>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AuditLogDrawer open={auditOpen} onClose={() => setAuditOpen(false)} />
      <RequestTracePanel open={traceOpen} onClose={() => setTraceOpen(false)} />

      <Toaster position="bottom-center" toastOptions={{ duration: 3500 }} />
    </FluentProvider>
  );
}
