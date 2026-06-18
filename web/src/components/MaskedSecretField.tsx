import { useState } from 'react';
import { Input, Button, makeStyles, tokens } from '@fluentui/react-components';
import { EyeRegular, EyeOffRegular } from '@fluentui/react-icons';

interface MaskedSecretFieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel: string;
}

const useStyles = makeStyles({
  row: { display: 'flex', gap: '4px', alignItems: 'center', width: '100%' },
  input: { flex: 1, fontFamily: tokens.fontFamilyMonospace },
});

/**
 * Password-style field with a reveal-on-hover toggle. Used for API keys
 * in the Settings drawer and per-request override panels.
 */
export function MaskedSecretField({ value, onChange, placeholder, ariaLabel }: MaskedSecretFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const styles = useStyles();
  return (
    <div className={styles.row}>
      <Input
        className={styles.input}
        type={revealed ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(_, d) => onChange(d.value)}
      />
      <Button
        appearance="subtle"
        size="small"
        icon={revealed ? <EyeOffRegular /> : <EyeRegular />}
        aria-label={revealed ? 'Hide value' : 'Reveal value'}
        onClick={() => setRevealed((v) => !v)}
      />
    </div>
  );
}
