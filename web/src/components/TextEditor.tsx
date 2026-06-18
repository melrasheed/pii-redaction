import { useEffect, useMemo, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { makeStyles, tokens } from '@fluentui/react-components';
import { useSettingsStore } from '../state/settingsStore';
import { isRtlLanguage } from '../constants/supportedLanguages';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  /** Optional list of character spans to highlight after detection. */
  highlights?: { offset: number; length: number; category: string; color: string }[];
}

const useStyles = makeStyles({
  wrap: {
    height: '320px',
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

/**
 * Monaco-based editor. Switches to RTL automatically for ar/he/fa/ur,
 * debounces change events at 300ms (cost protection — we never auto-call
 * the API on every keystroke), and applies decorations for entity spans
 * after a successful detection run.
 */
export function TextEditor({ value, onChange, language, highlights }: TextEditorProps) {
  const styles = useStyles();
  const darkMode = useSettingsStore((s) => s.ui.darkMode);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isRtl = useMemo(() => isRtlLanguage(language), [language]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.updateOptions({
      wordWrap: 'on',
      lineNumbers: 'on',
      minimap: { enabled: false },
      fontSize: 14,
      padding: { top: 8, bottom: 8 },
      scrollBeyondLastLine: false,
    });
    applyDecorations();
  };

  const applyDecorations = () => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const model = editor.getModel();
    if (!model) return;
    const decos = (highlights ?? []).map((h) => {
      const start = model.getPositionAt(h.offset);
      const end = model.getPositionAt(h.offset + h.length);
      const className = `pii-hl-${h.category.toLowerCase()}`;
      injectCssOnce(className, h.color);
      return {
        range: new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column),
        options: {
          inlineClassName: className,
          hoverMessage: { value: `**${h.category}** · offset ${h.offset} · length ${h.length}` },
        },
      };
    });
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, decos);
  };

  useEffect(() => {
    applyDecorations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlights]);

  return (
    <div
      className={styles.wrap}
      dir={isRtl ? 'rtl' : 'ltr'}
      style={isRtl ? { direction: 'rtl' } : undefined}
    >
      <Editor
        height="100%"
        defaultLanguage="plaintext"
        theme={darkMode ? 'vs-dark' : 'vs'}
        value={value}
        onMount={handleMount}
        onChange={(v) => {
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => onChange(v ?? ''), 300);
        }}
        options={{
          'semanticHighlighting.enabled': false,
        }}
      />
    </div>
  );
}

const injectedCss = new Set<string>();
function injectCssOnce(className: string, color: string) {
  if (injectedCss.has(className)) return;
  injectedCss.add(className);
  const style = document.createElement('style');
  style.innerHTML = `.${className}{background-color:${color}33;border-bottom:2px solid ${color};border-radius:2px;}`;
  document.head.appendChild(style);
}
