import { useEffect } from 'react';

type Handlers = {
  onDetect: () => void;
  onSendLlm: () => void;
  onOpenSettings: () => void;
};

/**
 * Wires the three global keyboard shortcuts:
 *   Ctrl/Cmd+Enter → Detect & Redact
 *   Ctrl/Cmd+L    → Send Redacted to LLM
 *   Ctrl/Cmd+,    → Open Settings
 *
 * Skips when the user is typing inside the Monaco editor (so Ctrl+L
 * still selects a line) — Monaco swallows its own key bindings before
 * we get them, except for Ctrl+Enter which we intercept regardless.
 */
export function useKeyboardShortcuts({ onDetect, onSendLlm, onOpenSettings }: Handlers) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        onDetect();
      } else if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        onSendLlm();
      } else if (e.key === ',') {
        e.preventDefault();
        onOpenSettings();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDetect, onSendLlm, onOpenSettings]);
}
