/**
 * Shared template types. Each industry file exports an array of these.
 * `text` should be 150–400 words, dense with category variety so the
 * highlight legend lights up across many categories.
 */
export type TemplateIndustry =
  | 'banking'
  | 'telecom'
  | 'healthcare'
  | 'legal'
  | 'support'
  | 'government';

export type TemplateLanguage = 'en' | 'ar';

export interface TemplateSample {
  id: string;
  title: string;
  industry: TemplateIndustry;
  language: TemplateLanguage;
  description: string;
  text: string;
}
