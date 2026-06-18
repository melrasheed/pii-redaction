import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { api, ProxyHeader } from '../lib/apiClient';
import type { ChatRequest, ChatResponse, ProxyError } from '../lib/types';
import { useSettingsStore } from '../state/settingsStore';
import { useAuditStore } from '../state/auditStore';

/**
 * React-query mutation that POSTs the SPA's redacted text + tokenisation
 * map to the proxy, which calls Azure OpenAI and rehydrates the response.
 */
export function useChat() {
  const openAi = useSettingsStore((s) => s.openAi);
  const pushAudit = useAuditStore((s) => s.push);

  return useMutation<ChatResponse, AxiosError<ProxyError>, ChatRequest>({
    mutationFn: async (req) => {
      const { data } = await api.post<ChatResponse>('/llm/chat', req, {
        headers: {
          [ProxyHeader.OpenAiEndpoint]: openAi.endpoint,
          [ProxyHeader.OpenAiKey]: openAi.key,
          [ProxyHeader.OpenAiDeployment]: openAi.deployment,
          [ProxyHeader.OpenAiApiVersion]: openAi.apiVersion,
        },
      });
      return data;
    },
    onSuccess: (data) => {
      pushAudit(data.audit);
    },
  });
}
