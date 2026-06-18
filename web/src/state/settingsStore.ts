import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PiiAnalyzeRequest } from '../lib/types';

/** Settings persisted to sessionStorage. Survives reloads, dies with the tab. */
export interface SettingsState {
  language: {
    endpoint: string;
    key: string;
    apiVersion: '2026-05-01' | '2026-05-15-preview' | '2025-11-15-preview';
    mode: 'cloud' | 'container';
  };
  openAi: {
    endpoint: string;
    key: string;
    deployment: string;
    apiVersion: string;
    modelName: string;
    maxTokens: number;
    temperature: number;
    systemPrompt: string;
  };
  piiDefaults: Omit<PiiAnalyzeRequest, 'text'>;
  ui: {
    darkMode: boolean;
  };

  setLanguage: (patch: Partial<SettingsState['language']>) => void;
  setOpenAi: (patch: Partial<SettingsState['openAi']>) => void;
  setPiiDefaults: (patch: Partial<SettingsState['piiDefaults']>) => void;
  setUi: (patch: Partial<SettingsState['ui']>) => void;
  reset: () => void;
  importJson: (json: string) => void;
  exportJson: () => string;
}

const defaultState: Omit<
  SettingsState,
  'setLanguage' | 'setOpenAi' | 'setPiiDefaults' | 'setUi' | 'reset' | 'importJson' | 'exportJson'
> = {
  language: {
    endpoint: '',
    key: '',
    apiVersion: '2026-05-01',
    mode: 'cloud',
  },
  openAi: {
    endpoint: '',
    key: '',
    deployment: 'gpt-4o',
    apiVersion: '2024-10-21',
    modelName: 'gpt-4o',
    maxTokens: 800,
    temperature: 0.2,
    systemPrompt:
      'You are a customer support summarizer. Summarize the following anonymized record in 3-5 bullet points. Preserve any token placeholders like [PERSON_1] or [EMAIL_2] exactly as-is so the system can rehydrate them.',
  },
  piiDefaults: {
    language: 'en',
    apiVersion: '2026-05-01',
    modelVersion: 'latest',
    domain: 'none',
    piiCategories: [],
    excludePiiCategories: [],
    redactionPolicy: 'entityMaskWithNumericSuffix',
    redactionCharacter: '*',
    minimumConfidenceScore: 0,
    excludedValues: [],
    synonyms: {},
    loggingOptOut: true,
    stringIndexType: 'Utf16CodeUnit',
    showStats: false,
  },
  ui: {
    darkMode: false,
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setLanguage: (patch) => set((s) => ({ language: { ...s.language, ...patch } })),
      setOpenAi: (patch) => set((s) => ({ openAi: { ...s.openAi, ...patch } })),
      setPiiDefaults: (patch) => set((s) => ({ piiDefaults: { ...s.piiDefaults, ...patch } })),
      setUi: (patch) => set((s) => ({ ui: { ...s.ui, ...patch } })),
      reset: () => set({ ...defaultState }),
      importJson: (json) => {
        const parsed = JSON.parse(json) as Partial<SettingsState>;
        set((s) => ({
          ...s,
          ...(parsed.language ? { language: { ...s.language, ...parsed.language } } : {}),
          ...(parsed.openAi ? { openAi: { ...s.openAi, ...parsed.openAi } } : {}),
          ...(parsed.piiDefaults ? { piiDefaults: { ...s.piiDefaults, ...parsed.piiDefaults } } : {}),
          ...(parsed.ui ? { ui: { ...s.ui, ...parsed.ui } } : {}),
        }));
      },
      exportJson: () => {
        const { language, openAi, piiDefaults, ui } = get();
        return JSON.stringify({ language, openAi, piiDefaults, ui }, null, 2);
      },
    }),
    {
      name: 'pii-demo-settings',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({
        language: s.language,
        openAi: s.openAi,
        piiDefaults: s.piiDefaults,
        ui: s.ui,
      }),
      version: 1,
    }
  )
);
