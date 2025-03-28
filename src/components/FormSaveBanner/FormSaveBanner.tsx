// components/FormSaveBanner.tsx
"use client";

import { useFormSaveContext } from "@/context/FormSaveContext";

export function FormSaveBanner() {
  const { isAnyDirty } = useFormSaveContext();

  if (!isAnyDirty) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-destructive text-white text-sm px-4 py-2 rounded shadow">
      Existem formulários com alterações não salvas.
    </div>
  );
}
