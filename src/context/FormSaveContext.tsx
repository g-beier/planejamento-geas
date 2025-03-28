// context/FormSaveContext.tsx
"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface FormSaveContextValue {
  markDirty: (id: string) => void;
  markSaved: (id: string) => void;
  isAnyDirty: boolean;
  dirtyForms: string[];
}

const FormSaveContext = createContext<FormSaveContextValue | undefined>(
  undefined
);

export function FormSaveProvider({ children }: { children: React.ReactNode }) {
  const [dirtyForms, setDirtyForms] = useState<Set<string>>(new Set());

  const markDirty = useCallback((id: string) => {
    setDirtyForms((prev) => new Set(prev).add(id));
  }, []);

  const markSaved = useCallback((id: string) => {
    setDirtyForms((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <FormSaveContext.Provider
      value={{
        markDirty,
        markSaved,
        dirtyForms: Array.from(dirtyForms),
        isAnyDirty: dirtyForms.size > 0,
      }}
    >
      {children}
    </FormSaveContext.Provider>
  );
}

export function useFormSaveContext() {
  const ctx = useContext(FormSaveContext);
  if (!ctx)
    throw new Error("useFormSaveContext must be used within FormSaveProvider");
  return ctx;
}
