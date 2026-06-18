import { create } from 'zustand';
import type { EntityDto, MappingEntry } from '../lib/types';

interface MappingState {
  /** Current Monaco editor content (single source of truth, lifted out of Workbench). */
  editorText: string;
  /** Snapshot of the editor text at the moment of the last successful detection. */
  originalText: string;
  redactedText: string;
  entities: EntityDto[];
  mapping: MappingEntry[];
  setEditorText: (v: string) => void;
  set: (state: Partial<Omit<MappingState, 'set' | 'reset' | 'setEditorText'>>) => void;
  reset: () => void;
}

/**
 * Ephemeral store for the editor text and most recent PII detection result.
 * Populates the Side-by-Side / Diff / Entities / Mapping views and supplies
 * the mapping to the LLM rehydration step.
 */
export const useMappingStore = create<MappingState>((set) => ({
  editorText: '',
  originalText: '',
  redactedText: '',
  entities: [],
  mapping: [],
  setEditorText: (v) => set({ editorText: v }),
  set: (state) => set(state),
  reset: () => set({ editorText: '', originalText: '', redactedText: '', entities: [], mapping: [] }),
}));
