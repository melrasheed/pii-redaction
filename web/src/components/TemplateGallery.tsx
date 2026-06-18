import { useState } from 'react';
import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Accordion,
  Body1,
  Body1Strong,
  Caption1,
  TabList,
  Tab,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { INDUSTRY_META, TEMPLATES_BY_INDUSTRY } from '../templates';
import type { TemplateLanguage, TemplateSample } from '../templates/types';

interface TemplateGalleryProps {
  onPick: (sample: TemplateSample) => void;
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    height: '100%',
    overflowY: 'auto',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '4px 6px 8px',
  },
  emoji: { fontSize: '20px', marginRight: '6px' },
  tabs: { padding: '4px 0 6px' },
  sample: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '8px 10px',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      borderTopColor: tokens.colorBrandStroke2,
      borderRightColor: tokens.colorBrandStroke2,
      borderBottomColor: tokens.colorBrandStroke2,
      borderLeftColor: tokens.colorBrandStroke2,
    },
  },
  desc: { color: tokens.colorNeutralForeground2 },
});

/** Left-rail accordion of industries × language tabs × clickable samples. */
export function TemplateGallery({ onPick }: TemplateGalleryProps) {
  const styles = useStyles();
  const [lang, setLang] = useState<TemplateLanguage>('en');

  return (
    <aside className={styles.root} aria-label="Template gallery">
      <div className={styles.header}>
        <Body1Strong>Template gallery</Body1Strong>
        <Caption1>Pick a long-form sample to load into the editor.</Caption1>
      </div>
      <div className={styles.tabs}>
        <TabList
          selectedValue={lang}
          onTabSelect={(_, d) => setLang(d.value as TemplateLanguage)}
          size="small"
        >
          <Tab value="en">English</Tab>
          <Tab value="ar" style={{ fontFamily: 'system-ui' }}>
            العربية
          </Tab>
        </TabList>
      </div>
      <Accordion multiple defaultOpenItems={['banking']} collapsible>
        {INDUSTRY_META.map((industry) => {
          const samples = TEMPLATES_BY_INDUSTRY[industry.id].filter((s) => s.language === lang);
          return (
            <AccordionItem key={industry.id} value={industry.id}>
              <AccordionHeader>
                <span className={styles.emoji}>{industry.emoji}</span>
                {industry.label}
                <Caption1 style={{ marginLeft: 8, color: tokens.colorNeutralForeground3 }}>
                  {samples.length}
                </Caption1>
              </AccordionHeader>
              <AccordionPanel>
                {samples.length === 0 ? (
                  <Caption1>No samples in this language yet.</Caption1>
                ) : (
                  samples.map((s) => (
                    <div
                      key={s.id}
                      className={styles.sample}
                      role="button"
                      tabIndex={0}
                      onClick={() => onPick(s)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onPick(s);
                        }
                      }}
                    >
                      <Body1>{s.title}</Body1>
                      <Caption1 className={styles.desc}>{s.description}</Caption1>
                    </div>
                  ))
                )}
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </aside>
  );
}
