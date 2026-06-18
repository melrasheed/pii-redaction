/**
 * Full Azure AI Language Text PII entity taxonomy.
 *
 * Sources:
 *  - https://learn.microsoft.com/azure/ai-services/language-service/personally-identifiable-information/concepts/entity-categories-list
 *  - https://learn.microsoft.com/azure/ai-services/language-service/personally-identifiable-information/concepts/entity-categories
 *
 * The display colour is used by the EntityHighlighter to colour spans in the
 * side-by-side view. `isPreview` is shown as a "Preview" badge.
 * `tooltip` is the 1–2 line conceptual explanation surfaced under the
 * info icon next to each multi-select chip (cited per the Microsoft Learn
 * concept page; no marketing fluff).
 */
export type PiiGroup =
  | 'Personal'
  | 'Financial'
  | 'Government IDs'
  | 'Healthcare'
  | 'Azure secrets'
  | 'Country-specific';

export interface PiiCategoryMeta {
  category: string;
  group: PiiGroup;
  color: string;
  isPreview?: boolean;
  tooltip: string;
}

export const PII_CATEGORIES: PiiCategoryMeta[] = [
  // ── Personal ────────────────────────────────────────────────
  { category: 'Person',           group: 'Personal', color: '#0078D4', tooltip: 'Names of people. Use to scrub natural-person identifiers.' },
  { category: 'PersonType',       group: 'Personal', color: '#0099BC', tooltip: 'Job roles or titles (Doctor, Engineer) — useful when titles are PII-adjacent.' },
  { category: 'PhoneNumber',      group: 'Personal', color: '#8764B8', tooltip: 'International or local phone numbers.' },
  { category: 'Email',            group: 'Personal', color: '#B146C2', tooltip: 'Email addresses.' },
  { category: 'URL',              group: 'Personal', color: '#5C2D91', tooltip: 'URLs that may contain user identifiers (profile pages, share links).' },
  { category: 'IPAddress',        group: 'Personal', color: '#498205', tooltip: 'IPv4/IPv6 addresses.' },
  { category: 'Address',          group: 'Personal', color: '#107C10', tooltip: 'Full or partial postal addresses.' },
  { category: 'DateOfBirth',      group: 'Personal', color: '#D13438', isPreview: true, tooltip: 'Date of birth. Preview category.' },
  { category: 'Age',              group: 'Personal', color: '#A4262C', tooltip: 'Person age expressed as a number or range.' },
  { category: 'Date',             group: 'Personal', color: '#FF8C00', tooltip: 'Calendar dates. Often combined with other PII to identify individuals.' },
  { category: 'Organization',     group: 'Personal', color: '#5A2D91', tooltip: 'Company / organisation names.' },
  { category: 'GPE',              group: 'Personal', color: '#C239B3', isPreview: true, tooltip: 'Geopolitical entity (country, city, region). Preview category.' },
  { category: 'Location',         group: 'Personal', color: '#E3008C', isPreview: true, tooltip: 'Generic locations — broader than GPE. Preview category.' },
  { category: 'City',             group: 'Personal', color: '#E81123', isPreview: true, tooltip: 'City names. Preview category.' },
  { category: 'State',            group: 'Personal', color: '#BF0077', isPreview: true, tooltip: 'State / province names. Preview category.' },
  { category: 'ZipCode',          group: 'Personal', color: '#9A0089', isPreview: true, tooltip: 'Postal / ZIP codes. Preview category.' },
  { category: 'Airport',          group: 'Personal', color: '#4F6BED', isPreview: true, tooltip: 'IATA / ICAO airport codes. Preview category.' },

  // ── Financial ───────────────────────────────────────────────
  { category: 'CreditCardNumber',     group: 'Financial', color: '#D83B01', tooltip: 'Payment card numbers (PAN).' },
  { category: 'InternationalBankingAccountNumber', group: 'Financial', color: '#CA5010', tooltip: 'IBAN — international bank account number.' },
  { category: 'SWIFTCode',            group: 'Financial', color: '#C19C00', tooltip: 'SWIFT / BIC code identifying a financial institution.' },
  { category: 'ABARoutingNumber',     group: 'Financial', color: '#986F0B', tooltip: 'US bank ABA routing number.' },
  { category: 'BankAccountNumber',    group: 'Financial', color: '#7A7574', isPreview: true, tooltip: 'Generic bank account number. Preview category.' },
  { category: 'CVV',                  group: 'Financial', color: '#5D5A58', isPreview: true, tooltip: 'Card verification value (3-4 digit code). Preview category.' },
  { category: 'ExpirationDate',       group: 'Financial', color: '#69797E', isPreview: true, tooltip: 'Card or document expiration date. Preview category.' },
  { category: 'SortCode',             group: 'Financial', color: '#3B3A39', isPreview: true, tooltip: 'UK 6-digit sort code. Preview category.' },

  // ── Government IDs ──────────────────────────────────────────
  { category: 'USSocialSecurityNumber',           group: 'Government IDs', color: '#A80000', tooltip: 'US Social Security Number.' },
  { category: 'USIndividualTaxIdentification',    group: 'Government IDs', color: '#750B1C', tooltip: 'US ITIN (9-digit individual tax identification number).' },
  { category: 'EUPassportNumber',                 group: 'Government IDs', color: '#5C2D91', tooltip: 'EU country passport numbers.' },
  { category: 'EUNationalIdentificationNumber',   group: 'Government IDs', color: '#881798', tooltip: 'EU national identification numbers (varies per country).' },
  { category: 'DriversLicenseNumber',             group: 'Government IDs', color: '#B146C2', isPreview: true, tooltip: 'Driving license / permit number. Preview category.' },
  { category: 'LicensePlate',                     group: 'Government IDs', color: '#C239B3', isPreview: true, tooltip: 'Vehicle license / number plate. Preview category.' },
  { category: 'VIN',                              group: 'Government IDs', color: '#E3008C', isPreview: true, tooltip: 'Vehicle Identification Number. Preview category.' },

  // ── Healthcare ──────────────────────────────────────────────
  { category: 'USDEANumber',          group: 'Healthcare', color: '#107C10', tooltip: 'US DEA registration number for controlled substance prescribers.' },
  { category: 'USMedicareBeneficiaryIdentifier', group: 'Healthcare', color: '#0B6A0B', tooltip: 'US Medicare beneficiary identifier (MBI).' },
  { category: 'MedicalLicenseNumber', group: 'Healthcare', color: '#498205', tooltip: 'Medical practitioner license number.' },

  // ── Azure secrets ───────────────────────────────────────────
  { category: 'AzureSasUrl',          group: 'Azure secrets', color: '#0078D4', tooltip: 'Azure Storage Shared Access Signature URL.' },
  { category: 'AzureSubscriptionId',  group: 'Azure secrets', color: '#005A9E', tooltip: 'Azure subscription identifier GUID.' },
  { category: 'AzureKey',             group: 'Azure secrets', color: '#004578', tooltip: 'Azure resource key — often a high-entropy base64 string.' },
  { category: 'AzureStorageAccountKey', group: 'Azure secrets', color: '#002050', tooltip: 'Storage account access key.' },
  { category: 'AzureConnectionString',  group: 'Azure secrets', color: '#001834', tooltip: 'Azure resource connection string containing endpoint + key.' },
  { category: 'AzureIdentityClientId',  group: 'Azure secrets', color: '#3B3A39', tooltip: 'Azure managed identity / app registration client ID.' },
  { category: 'Password',               group: 'Azure secrets', color: '#A80000', isPreview: true, tooltip: 'Password values detected in free text. Preview category.' },

  // ── Country-specific (small representative set; extend as Microsoft adds them) ──
  { category: 'QatarPersonalIdentificationNumber', group: 'Country-specific', color: '#7E1B33', tooltip: 'Qatar national QID number (11 digits).' },
  { category: 'UKNationalInsuranceNumber',         group: 'Country-specific', color: '#A4262C', tooltip: 'UK National Insurance Number (NINO).' },
  { category: 'IndianPermanentAccount',            group: 'Country-specific', color: '#D13438', tooltip: 'India PAN number.' },
  { category: 'IndianAadhaarNumber',               group: 'Country-specific', color: '#CA5010', tooltip: 'India Aadhaar number (12 digits).' },
  { category: 'SaudiArabiaNationalIdentityNumber', group: 'Country-specific', color: '#986F0B', tooltip: 'Saudi Arabia national ID number.' },
  { category: 'UAEIdentityCard',                   group: 'Country-specific', color: '#C19C00', tooltip: 'UAE Emirates ID number.' },
];

/** Fallback colour for any category the API returns that isn't in the table. */
export const DEFAULT_ENTITY_COLOR = '#605E5C';

const META_BY_CATEGORY = new Map<string, PiiCategoryMeta>(PII_CATEGORIES.map((c) => [c.category, c]));

/** Look up display metadata for a category, falling back to neutral grey. */
export function getCategoryMeta(category: string): PiiCategoryMeta {
  return (
    META_BY_CATEGORY.get(category) ?? {
      category,
      group: 'Personal',
      color: DEFAULT_ENTITY_COLOR,
      tooltip: 'No metadata for this category yet.',
    }
  );
}

/** Group categories for the multi-select UI. */
export function groupedCategories(): { group: PiiGroup; categories: PiiCategoryMeta[] }[] {
  const groups: PiiGroup[] = ['Personal', 'Financial', 'Government IDs', 'Healthcare', 'Azure secrets', 'Country-specific'];
  return groups.map((g) => ({ group: g, categories: PII_CATEGORIES.filter((c) => c.group === g) }));
}
