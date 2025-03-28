// hooks/useFormSaveStatus.ts
import { useFormSaveContext } from "@/context/FormSaveContext";
import { useEffect } from "react";

export function useFormSaveStatus(id: string, isSaved: boolean) {
  const { markDirty, markSaved } = useFormSaveContext();

  useEffect(() => {
    if (isSaved) {
      markSaved(id);
    } else {
      markDirty(id);
    }
  }, [id, isSaved, markDirty, markSaved]);
}
