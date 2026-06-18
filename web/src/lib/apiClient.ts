import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useTraceStore } from '../state/traceStore';
import type { TraceEntry } from './types';

/**
 * Header names the backend reads to override per-request Azure config.
 * Keep in sync with `api/Models/ProxyHeaders.cs`.
 */
export const ProxyHeader = {
  LanguageEndpoint: 'X-Azure-Language-Endpoint',
  LanguageKey: 'X-Azure-Language-Key',
  OpenAiEndpoint: 'X-AOAI-Endpoint',
  OpenAiKey: 'X-AOAI-Key',
  OpenAiDeployment: 'X-AOAI-Deployment',
  OpenAiApiVersion: 'X-AOAI-ApiVersion',
} as const;

const SENSITIVE_HEADERS = new Set([
  ProxyHeader.LanguageKey.toLowerCase(),
  ProxyHeader.OpenAiKey.toLowerCase(),
  'ocp-apim-subscription-key',
  'api-key',
  'authorization',
]);

function maskHeaders(headers: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers ?? {})) {
    if (v == null) continue;
    if (typeof v === 'object') continue;
    out[k] = SENSITIVE_HEADERS.has(k.toLowerCase()) ? '***redacted***' : String(v);
  }
  return out;
}

function inferKind(url: string | undefined): 'pii' | 'llm' {
  if (!url) return 'pii';
  if (url.includes('/llm/')) return 'llm';
  return 'pii';
}

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: { startTime: number; traceId: string };
  }
}

/**
 * Pre-configured Axios instance. Every request and response is pushed into
 * the in-memory trace store so the user sees a live ledger of HTTP traffic.
 * Sensitive headers are masked at capture time so they're never even in
 * memory in cleartext after the request finishes.
 */
export const api = axios.create({
  baseURL: '/api',
  timeout: 120_000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.metadata = {
    startTime: performance.now(),
    traceId: crypto.randomUUID(),
  };
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    pushTrace(response, undefined);
    return response;
  },
  (error: AxiosError) => {
    pushTrace(error.response, error);
    return Promise.reject(error);
  }
);

function pushTrace(response: AxiosResponse | undefined, error: AxiosError | undefined) {
  const config = (response?.config ?? error?.config) as InternalAxiosRequestConfig | undefined;
  if (!config) return;
  const start = config.metadata?.startTime ?? performance.now();
  const id = config.metadata?.traceId ?? crypto.randomUUID();
  const url = (config.baseURL ?? '') + (config.url ?? '');
  const requestHeaders = maskHeaders((config.headers ?? {}) as Record<string, unknown>);
  const responseHeaders: Record<string, string> = {};
  for (const [k, v] of Object.entries(response?.headers ?? {})) {
    responseHeaders[k] = String(v);
  }
  const entry: TraceEntry = {
    id,
    kind: inferKind(config.url),
    timestamp: new Date().toISOString(),
    method: (config.method ?? 'get').toUpperCase(),
    url,
    requestHeaders,
    requestBody: safeParse(config.data),
    status: response?.status ?? 0,
    latencyMs: Math.round(performance.now() - start),
    responseHeaders,
    responseBody: response?.data,
    ...(error ? { error: error.message } : {}),
  };
  useTraceStore.getState().push(entry);
}

function safeParse(data: unknown): unknown {
  if (typeof data !== 'string') return data;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}
