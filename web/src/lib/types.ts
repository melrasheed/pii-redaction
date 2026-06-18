/**
 * TypeScript types mirroring the backend DTOs. Kept hand-maintained
 * (rather than generated) to keep the demo zero-tooling and easy to read.
 */

export interface EntityDto {
  text: string;
  category: string;
  subcategory?: string | null;
  confidenceScore: number;
  offset: number;
  length: number;
}

export interface MappingEntry {
  token: string;
  originalValue: string;
  category: string;
  subCategory?: string | null;
  confidence: number;
  occurrences: number[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  entityCount: number;
  latencyMs: number;
  success: boolean;
  error?: string | null;
}

/** What the SPA POSTs to `/api/pii/analyze`. */
export interface PiiAnalyzeRequest {
  text: string;
  language: string;
  apiVersion: string;
  modelVersion: string;
  domain: 'none' | 'phi';
  piiCategories: string[];
  excludePiiCategories: string[];
  redactionPolicy: 'noMask' | 'characterMask' | 'entityMask' | 'entityMaskWithNumericSuffix';
  redactionCharacter: string;
  minimumConfidenceScore: number;
  excludedValues: string[];
  synonyms: Record<string, string[]>;
  loggingOptOut: boolean;
  stringIndexType: 'Utf16CodeUnit' | 'Utf8CodeUnit' | 'TextElement_v8';
  showStats: boolean;
}

export interface PiiAnalyzeResponse {
  originalText: string;
  redactedText: string;
  entities: EntityDto[];
  mapping: MappingEntry[];
  rawRequest: unknown;
  rawResponse: unknown;
  latencyMs: number;
  audit: AuditEntry;
}

export interface ChatRequest {
  systemPrompt: string;
  userText: string;
  mapping: MappingEntry[];
  rehydrate: boolean;
  temperature: number;
  maxTokens: number;
}

export interface ChatResponse {
  llmMessage: string;
  rehydratedMessage: string;
  tokensNotFound: string[];
  rawRequest: unknown;
  rawResponse: unknown;
  latencyMs: number;
  audit: AuditEntry;
}

export interface ProxyError {
  errorCode: string;
  message: string;
  status: number;
  raw: unknown;
  retryAfterSeconds?: number | null;
}

/** One entry in the SPA-side request trace shown in the bottom drawer. */
export interface TraceEntry {
  id: string;
  kind: 'pii' | 'llm';
  timestamp: string;
  method: string;
  url: string;
  requestHeaders: Record<string, string>;
  requestBody: unknown;
  status: number;
  latencyMs: number;
  responseHeaders: Record<string, string>;
  responseBody: unknown;
  error?: string;
}
