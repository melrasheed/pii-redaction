/**
 * Languages supported by the Azure AI Language Text PII service.
 * Source: https://learn.microsoft.com/azure/ai-services/language-service/personally-identifiable-information/language-support
 * Last verified against the GA `2026-05-01` rollout.
 *
 * `isRtl` drives editor direction in the workbench and the side-by-side panes.
 */
export interface SupportedLanguage {
  code: string;
  englishName: string;
  nativeName: string;
  isRtl?: boolean;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'af', englishName: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'sq', englishName: 'Albanian', nativeName: 'Shqip' },
  { code: 'am', englishName: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'ar', englishName: 'Arabic', nativeName: 'العربية', isRtl: true },
  { code: 'hy', englishName: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'as', englishName: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'az', englishName: 'Azerbaijani', nativeName: 'Azərbaycan' },
  { code: 'bn', englishName: 'Bangla', nativeName: 'বাংলা' },
  { code: 'eu', englishName: 'Basque', nativeName: 'Euskara' },
  { code: 'bs', englishName: 'Bosnian', nativeName: 'Bosanski' },
  { code: 'bg', englishName: 'Bulgarian', nativeName: 'Български' },
  { code: 'my', englishName: 'Burmese', nativeName: 'မြန်မာ' },
  { code: 'ca', englishName: 'Catalan', nativeName: 'Català' },
  { code: 'zh-Hans', englishName: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-Hant', englishName: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'hr', englishName: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'cs', englishName: 'Czech', nativeName: 'Čeština' },
  { code: 'da', englishName: 'Danish', nativeName: 'Dansk' },
  { code: 'nl', englishName: 'Dutch', nativeName: 'Nederlands' },
  { code: 'en', englishName: 'English', nativeName: 'English' },
  { code: 'et', englishName: 'Estonian', nativeName: 'Eesti' },
  { code: 'fi', englishName: 'Finnish', nativeName: 'Suomi' },
  { code: 'fr', englishName: 'French', nativeName: 'Français' },
  { code: 'gl', englishName: 'Galician', nativeName: 'Galego' },
  { code: 'ka', englishName: 'Georgian', nativeName: 'ქართული' },
  { code: 'de', englishName: 'German', nativeName: 'Deutsch' },
  { code: 'el', englishName: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'gu', englishName: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ha', englishName: 'Hausa', nativeName: 'Hausa' },
  { code: 'he', englishName: 'Hebrew', nativeName: 'עברית', isRtl: true },
  { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'hu', englishName: 'Hungarian', nativeName: 'Magyar' },
  { code: 'is', englishName: 'Icelandic', nativeName: 'Íslenska' },
  { code: 'id', englishName: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ga', englishName: 'Irish', nativeName: 'Gaeilge' },
  { code: 'it', englishName: 'Italian', nativeName: 'Italiano' },
  { code: 'ja', englishName: 'Japanese', nativeName: '日本語' },
  { code: 'jv', englishName: 'Javanese', nativeName: 'Basa Jawa' },
  { code: 'kn', englishName: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'kk', englishName: 'Kazakh', nativeName: 'Қазақ' },
  { code: 'km', englishName: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'ko', englishName: 'Korean', nativeName: '한국어' },
  { code: 'ku', englishName: 'Kurdish', nativeName: 'Kurdî' },
  { code: 'ky', englishName: 'Kyrgyz', nativeName: 'Кыргыз' },
  { code: 'lo', englishName: 'Lao', nativeName: 'ລາວ' },
  { code: 'lv', englishName: 'Latvian', nativeName: 'Latviešu' },
  { code: 'lt', englishName: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'mk', englishName: 'Macedonian', nativeName: 'Македонски' },
  { code: 'ms', englishName: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'ml', englishName: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mt', englishName: 'Maltese', nativeName: 'Malti' },
  { code: 'mr', englishName: 'Marathi', nativeName: 'मराठी' },
  { code: 'mn', englishName: 'Mongolian', nativeName: 'Монгол' },
  { code: 'ne', englishName: 'Nepali', nativeName: 'नेपाली' },
  { code: 'no', englishName: 'Norwegian', nativeName: 'Norsk' },
  { code: 'or', englishName: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'ps', englishName: 'Pashto', nativeName: 'پښتو', isRtl: true },
  { code: 'fa', englishName: 'Persian', nativeName: 'فارسی', isRtl: true },
  { code: 'pl', englishName: 'Polish', nativeName: 'Polski' },
  { code: 'pt-BR', englishName: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)' },
  { code: 'pt-PT', englishName: 'Portuguese (Portugal)', nativeName: 'Português (Portugal)' },
  { code: 'pa', englishName: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ro', englishName: 'Romanian', nativeName: 'Română' },
  { code: 'ru', englishName: 'Russian', nativeName: 'Русский' },
  { code: 'sr', englishName: 'Serbian', nativeName: 'Српски' },
  { code: 'sd', englishName: 'Sindhi', nativeName: 'سنڌي', isRtl: true },
  { code: 'si', englishName: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'sk', englishName: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'sl', englishName: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'so', englishName: 'Somali', nativeName: 'Soomaali' },
  { code: 'es', englishName: 'Spanish', nativeName: 'Español' },
  { code: 'sw', englishName: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'sv', englishName: 'Swedish', nativeName: 'Svenska' },
  { code: 'tl', englishName: 'Tagalog', nativeName: 'Tagalog' },
  { code: 'ta', englishName: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', englishName: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'th', englishName: 'Thai', nativeName: 'ไทย' },
  { code: 'tr', englishName: 'Turkish', nativeName: 'Türkçe' },
  { code: 'uk', englishName: 'Ukrainian', nativeName: 'Українська' },
  { code: 'ur', englishName: 'Urdu', nativeName: 'اردو', isRtl: true },
  { code: 'uz', englishName: 'Uzbek', nativeName: 'Oʻzbek' },
  { code: 'vi', englishName: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'cy', englishName: 'Welsh', nativeName: 'Cymraeg' },
];

/** Returns whether a BCP-47 code (or its prefix) is right-to-left. */
export function isRtlLanguage(code: string | undefined | null): boolean {
  if (!code) return false;
  const lower = code.toLowerCase();
  return SUPPORTED_LANGUAGES.some(
    (l) => (l.isRtl ?? false) && (l.code.toLowerCase() === lower || lower.startsWith(l.code.toLowerCase() + '-'))
  );
}
