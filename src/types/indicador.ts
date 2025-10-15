export type AreaIndicador =
  | "VALORES"
  | "PROGRAMA_EDUCATIVO"
  | "RECURSOS_HUMANOS"
  | "GESTAO"
  | "FINANCAS"
  | "CRESCIMENTO";

export interface Indicador {
  id: string;
  pergunta: string;
  area: AreaIndicador;
}
