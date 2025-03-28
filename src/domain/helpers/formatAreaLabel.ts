export const areaLabels: Record<string, string> = {
  VALORES: "Valores",
  PROGRAMA_EDUCATIVO: "Programa Educativo",
  RECURSOS_HUMANOS: "Recursos Humanos",
  GESTAO: "Gestão Institucional",
  FINANCAS: "Finanças",
  CRESCIMENTO: "Crescimento",
};

export function formatAreaLabel(raw: string): string {
  return areaLabels[raw] || raw;
}
