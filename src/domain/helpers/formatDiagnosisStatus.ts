export const statusLabels: Record<string, string> = {
  SIM: "Sim",
  NAO: "Não",
  EM_PARTE: "Em parte",
};

export function formatDiagnosisStatus(raw: string): string {
  return statusLabels[raw] || raw;
}
