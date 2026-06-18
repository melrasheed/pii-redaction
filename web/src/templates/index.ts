import { bankingTemplates } from './banking';
import { telecomTemplates } from './telecom';
import { healthcareTemplates } from './healthcare';
import { legalTemplates } from './legal';
import { supportTemplates } from './support';
import { governmentTemplates } from './government';
import type { TemplateIndustry, TemplateLanguage, TemplateSample } from './types';

export type { TemplateIndustry, TemplateLanguage, TemplateSample };

/** All templates exported by industry — order drives the left-rail accordion. */
export const TEMPLATES_BY_INDUSTRY: Record<TemplateIndustry, TemplateSample[]> = {
  banking: bankingTemplates,
  telecom: telecomTemplates,
  healthcare: healthcareTemplates,
  legal: legalTemplates,
  support: supportTemplates,
  government: governmentTemplates,
};

/** Convenience: every template in a single array. */
export const ALL_TEMPLATES: TemplateSample[] = (Object.values(TEMPLATES_BY_INDUSTRY) as TemplateSample[][]).flat();

/** Industry display metadata for the left-rail accordion. */
export const INDUSTRY_META: { id: TemplateIndustry; label: string; emoji: string }[] = [
  { id: 'banking',     label: 'Banking',          emoji: '🏦' },
  { id: 'telecom',     label: 'Telecom',          emoji: '📞' },
  { id: 'healthcare',  label: 'Healthcare',       emoji: '🏥' },
  { id: 'legal',       label: 'Legal / HR',       emoji: '⚖️' },
  { id: 'support',     label: 'Customer Support', emoji: '💬' },
  { id: 'government',  label: 'Government',       emoji: '🏛️' },
];
