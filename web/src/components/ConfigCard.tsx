import {
  Body1Strong,
  Caption1,
  Checkbox,
  Dropdown,
  Field,
  Input,
  Option,
  Radio,
  RadioGroup,
  Slider,
  Switch,
  Tag,
  Tooltip,
  makeStyles,
  tokens,
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
} from '@fluentui/react-components';
import { Info16Regular } from '@fluentui/react-icons';
import { useState } from 'react';
import { useSettingsStore } from '../state/settingsStore';
import { SUPPORTED_LANGUAGES } from '../constants/supportedLanguages';
import { groupedCategories, getCategoryMeta } from '../constants/piiCategories';

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    padding: '12px 16px',
    marginBottom: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
    marginTop: '8px',
  },
  inline: { display: 'flex', alignItems: 'center', gap: '6px' },
  chipsWrap: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' },
  chip: { cursor: 'pointer', userSelect: 'none' },
  groupHeader: { fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground2, marginTop: '8px' },
});

function LabelWithInfo({ label, info }: { label: string; info: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {label}
      <Tooltip content={info} relationship="description" withArrow>
        <Info16Regular style={{ color: tokens.colorNeutralForeground3 }} />
      </Tooltip>
    </span>
  );
}

interface ConfigCardProps {
  collapsed?: boolean;
  onToggleCollapsed?: (v: boolean) => void;
}

/**
 * Per-request PII configuration card. Persisted via `settingsStore.piiDefaults`
 * — every change updates the store immediately so the next "Detect & Redact"
 * call picks it up. Every knob has an `<Info16>` tooltip citing the Microsoft
 * Learn concept in 1–2 lines.
 */
export function ConfigCard({ collapsed, onToggleCollapsed }: ConfigCardProps) {
  const styles = useStyles();
  const defaults = useSettingsStore((s) => s.piiDefaults);
  const setDefaults = useSettingsStore((s) => s.setPiiDefaults);
  const [excludedDraft, setExcludedDraft] = useState('');
  const [synonymKey, setSynonymKey] = useState('');
  const [synonymValues, setSynonymValues] = useState('');

  const addExcluded = () => {
    const v = excludedDraft.trim();
    if (!v) return;
    if (defaults.excludedValues.includes(v)) return;
    setDefaults({ excludedValues: [...defaults.excludedValues, v] });
    setExcludedDraft('');
  };
  const removeExcluded = (v: string) => {
    setDefaults({ excludedValues: defaults.excludedValues.filter((x) => x !== v) });
  };
  const addSynonym = () => {
    const k = synonymKey.trim();
    const vs = synonymValues.split(',').map((x) => x.trim()).filter(Boolean);
    if (!k || vs.length === 0) return;
    setDefaults({ synonyms: { ...defaults.synonyms, [k]: vs } });
    setSynonymKey('');
    setSynonymValues('');
  };
  const removeSynonym = (k: string) => {
    const next = { ...defaults.synonyms };
    delete next[k];
    setDefaults({ synonyms: next });
  };

  const toggleCategory = (cat: string, list: 'include' | 'exclude') => {
    if (list === 'include') {
      setDefaults({
        piiCategories: defaults.piiCategories.includes(cat)
          ? defaults.piiCategories.filter((c) => c !== cat)
          : [...defaults.piiCategories, cat],
      });
    } else {
      setDefaults({
        excludePiiCategories: defaults.excludePiiCategories.includes(cat)
          ? defaults.excludePiiCategories.filter((c) => c !== cat)
          : [...defaults.excludePiiCategories, cat],
      });
    }
  };

  return (
    <section className={styles.root} aria-label="Per-request PII configuration">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Body1Strong>Per-request configuration</Body1Strong>
        {onToggleCollapsed ? (
          <Switch
            label={collapsed ? 'Show all knobs' : 'Compact'}
            checked={!collapsed}
            onChange={(_, d) => onToggleCollapsed(!d.checked)}
          />
        ) : null}
      </div>

      <div className={styles.grid}>
        <Field label={<LabelWithInfo label="Language" info="BCP-47 language code passed to Azure. Switch the editor to RTL automatically for Arabic, Hebrew, Persian, Urdu, Pashto, Sindhi." />}>
          <Dropdown
            value={SUPPORTED_LANGUAGES.find((l) => l.code === defaults.language)?.englishName ?? defaults.language}
            selectedOptions={[defaults.language]}
            onOptionSelect={(_, d) => setDefaults({ language: (d.optionValue ?? 'en') })}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <Option key={l.code} value={l.code} text={l.englishName}>
                {l.englishName} <Caption1 style={{ marginLeft: 6, color: tokens.colorNeutralForeground3 }}>{l.nativeName}</Caption1>
              </Option>
            ))}
          </Dropdown>
        </Field>

        <Field label={<LabelWithInfo label="API version" info="Azure AI Language REST API version. 2026-05-01 is GA; previews allow opt-in to newer entity types." />}>
          <Dropdown
            value={defaults.apiVersion}
            selectedOptions={[defaults.apiVersion]}
            onOptionSelect={(_, d) => setDefaults({ apiVersion: (d.optionValue ?? '2026-05-01') })}
          >
            <Option value="2026-05-01">2026-05-01 (GA)</Option>
            <Option value="2026-05-15-preview">2026-05-15-preview</Option>
            <Option value="2025-11-15-preview">2025-11-15-preview</Option>
          </Dropdown>
        </Field>

        <Field label={<LabelWithInfo label="Model version" info="PII model version. Use 'latest' to track Microsoft's GA model upgrades automatically." />}>
          <Input value={defaults.modelVersion} onChange={(_, d) => setDefaults({ modelVersion: d.value })} />
        </Field>

        <Field label={<LabelWithInfo label="Domain" info="Set to 'phi' to optimise for Protected Health Information; 'none' is the general-purpose model." />}>
          <Dropdown
            value={defaults.domain}
            selectedOptions={[defaults.domain]}
            onOptionSelect={(_, d) => setDefaults({ domain: (d.optionValue as 'none' | 'phi') ?? 'none' })}
          >
            <Option value="none">none</Option>
            <Option value="phi">phi (healthcare)</Option>
          </Dropdown>
        </Field>

        <Field label={<LabelWithInfo label="String index type" info="Indexing unit for offsets/lengths. Utf16CodeUnit is the safe default for JavaScript clients." />}>
          <Dropdown
            value={defaults.stringIndexType}
            selectedOptions={[defaults.stringIndexType]}
            onOptionSelect={(_, d) => setDefaults({ stringIndexType: (d.optionValue ?? 'Utf16CodeUnit') as 'Utf16CodeUnit' | 'Utf8CodeUnit' | 'TextElement_v8' })}
          >
            <Option value="Utf16CodeUnit">Utf16CodeUnit (default)</Option>
            <Option value="Utf8CodeUnit">Utf8CodeUnit</Option>
            <Option value="TextElement_v8">TextElement_v8</Option>
          </Dropdown>
        </Field>

        <Field label={<LabelWithInfo label="Minimum confidence" info="Client-side filter — drop entities Azure returns with confidence below this threshold (0–1)." />}>
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={defaults.minimumConfidenceScore}
            onChange={(_, d) => setDefaults({ minimumConfidenceScore: d.value })}
          />
          <Caption1>{defaults.minimumConfidenceScore.toFixed(2)}</Caption1>
        </Field>

        <Field label={<LabelWithInfo label="Logging opt-out" info="Forwards loggingOptOut=true to Azure so Microsoft does not log request content — credibility booster for regulated demos." />}>
          <Switch
            checked={defaults.loggingOptOut}
            onChange={(_, d) => setDefaults({ loggingOptOut: d.checked })}
            label={defaults.loggingOptOut ? 'On (no Microsoft-side logging)' : 'Off'}
          />
        </Field>

        <Field label={<LabelWithInfo label="Show stats" info="Forwards showStats=true so Azure returns processing statistics in the response." />}>
          <Checkbox checked={defaults.showStats} onChange={(_, d) => setDefaults({ showStats: !!d.checked })} label="Include statistics" />
        </Field>
      </div>

      <div style={{ marginTop: '14px' }}>
        <LabelWithInfo
          label="Redaction policy"
          info="entityMaskWithNumericSuffix is implemented by the local proxy as a deterministic post-pass over Azure's noMask response so the demo works on every API version and enables reverse-tokenisation."
        />
        <RadioGroup
          layout="horizontal"
          value={defaults.redactionPolicy}
          onChange={(_, d) => setDefaults({ redactionPolicy: d.value as typeof defaults.redactionPolicy })}
        >
          <Radio value="noMask" label="noMask (entities only)" />
          <Radio value="characterMask" label="characterMask" />
          <Radio value="entityMask" label="entityMask" />
          <Radio value="entityMaskWithNumericSuffix" label="entityMaskWithNumericSuffix (tokenised)" />
        </RadioGroup>
        {defaults.redactionPolicy === 'characterMask' ? (
          <Field label="Redaction character" style={{ marginTop: '8px', maxWidth: '160px' }}>
            <Input
              value={defaults.redactionCharacter}
              maxLength={1}
              onChange={(_, d) => setDefaults({ redactionCharacter: d.value || '*' })}
            />
          </Field>
        ) : null}
      </div>

      <Accordion multiple style={{ marginTop: '14px' }} collapsible>
        <AccordionItem value="categories">
          <AccordionHeader>PII categories (include / exclude)</AccordionHeader>
          <AccordionPanel>
            <Caption1>
              Leave both lists empty to use Azure's default category set. Click a chip in "Include" to scope detection;
              click in "Exclude" to suppress that category from the response.
            </Caption1>
            {groupedCategories().map(({ group, categories }) => (
              <div key={group}>
                <div className={styles.groupHeader}>{group}</div>
                <div>
                  <Caption1>Include:</Caption1>
                  <div className={styles.chipsWrap}>
                    {categories.map((c) => {
                      const meta = getCategoryMeta(c.category);
                      const selected = defaults.piiCategories.includes(c.category);
                      return (
                        <Tag
                          key={c.category}
                          className={styles.chip}
                          appearance={selected ? 'brand' : 'outline'}
                          onClick={() => toggleCategory(c.category, 'include')}
                          shape="circular"
                          dismissible={false}
                          style={selected ? { backgroundColor: meta.color, color: '#fff' } : undefined}
                        >
                          {c.category}
                          {c.isPreview ? <span style={{ marginLeft: 4, opacity: 0.7 }}>·preview</span> : null}
                        </Tag>
                      );
                    })}
                  </div>
                </div>
                <div style={{ marginTop: '6px' }}>
                  <Caption1>Exclude:</Caption1>
                  <div className={styles.chipsWrap}>
                    {categories.map((c) => {
                      const selected = defaults.excludePiiCategories.includes(c.category);
                      return (
                        <Tag
                          key={c.category}
                          className={styles.chip}
                          appearance={selected ? 'brand' : 'outline'}
                          shape="circular"
                          dismissible={false}
                          onClick={() => toggleCategory(c.category, 'exclude')}
                        >
                          {c.category}
                        </Tag>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="excludedValues">
          <AccordionHeader>Excluded values</AccordionHeader>
          <AccordionPanel>
            <Caption1>Exact strings the proxy will drop from the entity list even if Azure flags them (e.g. "Microsoft").</Caption1>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              <Input value={excludedDraft} onChange={(_, d) => setExcludedDraft(d.value)} placeholder="e.g. Microsoft" style={{ flex: 1 }} />
              <button onClick={addExcluded}>Add</button>
            </div>
            <div className={styles.chipsWrap}>
              {defaults.excludedValues.map((v) => (
                <Tag key={v} appearance="filled" dismissible onClick={() => removeExcluded(v)} title="Remove">
                  {v}
                </Tag>
              ))}
            </div>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem value="synonyms">
          <AccordionHeader>Synonyms (canonicalisation)</AccordionHeader>
          <AccordionPanel>
            <Caption1>Any alias rewrites to the canonical key before tokenisation. Aliases comma-separated.</Caption1>
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              <Input value={synonymKey} onChange={(_, d) => setSynonymKey(d.value)} placeholder="Canonical, e.g. Microsoft" style={{ flex: 1, minWidth: '160px' }} />
              <Input value={synonymValues} onChange={(_, d) => setSynonymValues(d.value)} placeholder="MSFT, Microsoft Corporation" style={{ flex: 2, minWidth: '200px' }} />
              <button onClick={addSynonym}>Add</button>
            </div>
            <div className={styles.chipsWrap}>
              {Object.entries(defaults.synonyms).map(([k, vs]) => (
                <Tag key={k} appearance="filled" dismissible onClick={() => removeSynonym(k)} title="Remove">
                  {k} → [{vs.join(', ')}]
                </Tag>
              ))}
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
