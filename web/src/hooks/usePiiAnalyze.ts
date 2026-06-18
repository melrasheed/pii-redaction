import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { api, ProxyHeader } from '../lib/apiClient';
import type { PiiAnalyzeRequest, PiiAnalyzeResponse, ProxyError } from '../lib/types';
import { useSettingsStore } from '../state/settingsStore';
import { useMappingStore } from '../state/mappingStore';
import { useAuditStore } from '../state/auditStore';

/**
 * React-query mutation that POSTs the SPA's `PiiAnalyzeRequest` to the proxy
 * with the appropriate header overrides, then updates the mapping store
 * and audit log on success.
 */
export function usePiiAnalyze() {
  const language = useSettingsStore((s) => s.language);
  const setMapping = useMappingStore((s) => s.set);
  const pushAudit = useAuditStore((s) => s.push);

  return useMutation<PiiAnalyzeResponse, AxiosError<ProxyError>, PiiAnalyzeRequest>({
    mutationFn: async (req) => {
      const { data } = await api.post<PiiAnalyzeResponse>('/pii/analyze', req, {
        headers: {
          [ProxyHeader.LanguageEndpoint]: language.endpoint,
          [ProxyHeader.LanguageKey]: language.key,
        },
      });
      return data;
    },
    onSuccess: (data) => {
      setMapping({
        originalText: data.originalText,
        redactedText: data.redactedText,
        entities: data.entities,
        mapping: data.mapping,
      });
      pushAudit(data.audit);
    },
  });
}
