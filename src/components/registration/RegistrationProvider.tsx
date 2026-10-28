"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { RegistrationDialog } from "./RegistrationDialog";

interface RegistrationContextValue {
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openDialog, closeDialog }),
    [open, openDialog, closeDialog],
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
      <RegistrationDialog open={open} onClose={closeDialog} />
    </RegistrationContext.Provider>
  );
}

export function useRegistration(): RegistrationContextValue {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error("useRegistration must be used inside RegistrationProvider");
  }
  return context;
}
