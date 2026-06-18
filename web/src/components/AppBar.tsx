import { Badge, Button, Switch, Tooltip, makeStyles, tokens } from '@fluentui/react-components';
import {
  Settings24Regular,
  History24Regular,
  WeatherMoon24Regular,
  WeatherSunny24Regular,
} from '@fluentui/react-icons';
import { useSettingsStore } from '../state/settingsStore';
import { useAuditStore } from '../state/auditStore';

interface AppBarProps {
  onOpenSettings: () => void;
  onOpenAudit: () => void;
}

const useStyles = makeStyles({
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '56px',
    padding: '0 20px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow2,
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  left: { display: 'flex', alignItems: 'center', gap: '12px' },
  right: { display: 'flex', alignItems: 'center', gap: '6px' },
  logo: {
    width: '20px',
    height: '20px',
    display: 'inline-block',
    background:
      'conic-gradient(from 0deg at 50% 50%, #F25022 0deg 90deg, #7FBA00 90deg 180deg, #FFB900 180deg 270deg, #00A4EF 270deg 360deg)',
    transform: 'rotate(-90deg)',
    borderRadius: '2px',
  },
  title: {
    fontFamily: tokens.fontFamilyBase,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
  disclaimer: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase100,
    fontStyle: 'italic',
    marginLeft: '12px',
  },
  swap: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
  },
});

/** Top-of-page bar with logo, title, audit/settings buttons and dark-mode toggle. */
export function AppBar({ onOpenSettings, onOpenAudit }: AppBarProps) {
  const styles = useStyles();
  const darkMode = useSettingsStore((s) => s.ui.darkMode);
  const setUi = useSettingsStore((s) => s.setUi);
  const auditCount = useAuditStore((s) => s.entries.length);

  return (
    <header className={styles.bar} role="banner">
      <div className={styles.left}>
        <span className={styles.logo} aria-hidden />
        <span className={styles.title}>Azure AI Language</span>
        <span className={styles.subtitle}>— PII Redaction Studio</span>
        <span className={styles.disclaimer}>Demo only — no production telemetry.</span>
      </div>
      <div className={styles.right}>
        <Tooltip content="Audit log" relationship="label">
          <span className={styles.swap}>
            <Button appearance="subtle" icon={<History24Regular />} onClick={onOpenAudit} aria-label="Open audit log" />
            {auditCount > 0 ? (
              <Badge className={styles.badge} appearance="filled" color="brand" size="small">
                {auditCount > 99 ? '99+' : auditCount}
              </Badge>
            ) : null}
          </span>
        </Tooltip>
        <Tooltip content="Settings (Ctrl+,)" relationship="label">
          <Button appearance="subtle" icon={<Settings24Regular />} onClick={onOpenSettings} aria-label="Open settings" />
        </Tooltip>
        <Tooltip content={darkMode ? 'Switch to light' : 'Switch to dark'} relationship="label">
          <Switch
            checked={darkMode}
            onChange={(_, d) => setUi({ darkMode: d.checked })}
            label={darkMode ? <WeatherMoon24Regular /> : <WeatherSunny24Regular />}
          />
        </Tooltip>
      </div>
    </header>
  );
}
