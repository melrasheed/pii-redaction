import { create } from 'zustand';
import type { TraceEntry } from '../lib/types';

const MAX_ENTRIES = 200;

interface TraceState {
  entries: TraceEntry[];
  push: (entry: TraceEntry) => void;
  clear: () => void;
}

/** Ephemeral in-memory request trace. Lives only as long as the tab is open. */
export const useTraceStore = create<TraceState>((set) => ({
  entries: [],
  push: (entry) =>
    set((s) => ({
      entries: [entry, ...s.entries].slice(0, MAX_ENTRIES),
    })),
  clear: () => set({ entries: [] }),
}));
