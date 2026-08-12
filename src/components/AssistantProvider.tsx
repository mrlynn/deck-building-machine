'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { WizardAssistantState } from '@/lib/assistant/prompt';

type AssistantContextValue = {
  open: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
  wizardState: WizardAssistantState | null;
  setWizardState: (state: WizardAssistantState) => void;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [wizardState, setWizardState] = useState<WizardAssistantState | null>(
    null,
  );

  const openAssistant = useCallback(() => setOpen(true), []);
  const closeAssistant = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({
      open,
      openAssistant,
      closeAssistant,
      wizardState,
      setWizardState,
    }),
    [open, openAssistant, closeAssistant, wizardState],
  );

  return (
    <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
  );
}

export function useAssistant(): AssistantContextValue {
  const ctx = useContext(AssistantContext);
  if (!ctx) {
    throw new Error('useAssistant must be used within AssistantProvider');
  }
  return ctx;
}
