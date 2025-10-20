import { z } from "zod";

export enum AreaIndicadorEnum {
  VALORES = "VALORES",
  PROGRAMA_EDUCATIVO = "PROGRAMA_EDUCATIVO",
  RECURSOS_HUMANOS = "RECURSOS_HUMANOS",
  GESTAO = "GESTAO",
  FINANCAS = "FINANCAS",
  CRESCIMENTO = "CRESCIMENTO",
}
const AreaIndicador = z.enum(AreaIndicadorEnum);

export const IndicadorSchema = z.object({
  id: z.string().length(3),
  pergunta: z.string(),
  area: AreaIndicador,
});
