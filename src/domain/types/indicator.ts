export type IndicatorArea =
  | "VALORES"
  | "PROGRAMA_EDUCATIVO"
  | "RECURSOS_HUMANOS"
  | "GESTAO"
  | "FINANCAS"
  | "CRESCIMENTO";

export type Indicator = {
  id: string; // char(3)
  question: string;
  area: IndicatorArea;
};
