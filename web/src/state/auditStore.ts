import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuditEntry } from '../lib/types';

const MAX_ENTRIES = 500;

interface AuditState {
  entries: AuditEntry[];
  push: (entry: AuditEntry) => void;
  pushClient: (partial: Omit<AuditEntry, 'id' | 'timestamp' | 'actor'>) => void;
  clear: () => void;
  exportJson: () => string;
}

/** Audit log persisted to sessionStorage so it survives F5 during a demo. */
export const useAuditStore = create<AuditState>()(
  persist(
    (set, get) => ({
      entries: [],
      push: (entry) =>
        set((s) => ({
          entries: [entry, ...s.entries].slice(0, MAX_ENTRIES),
        })),
      pushClient: (partial) =>
        set((s) => ({
          entries: [
            {
              id: crypto.randomUUID(),
              timestamp: new Date().toISOString(),
              actor: 'local',
              ...partial,
            },
            ...s.entries,
          ].slice(0, MAX_ENTRIES),
        })),
      clear: () => set({ entries: [] }),
      exportJson: () => JSON.stringify(get().entries, null, 2),
    }),
    {
      name: 'pii-demo-audit',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ entries: s.entries }),
      version: 1,
    }
  )
);
