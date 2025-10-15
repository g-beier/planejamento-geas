import { z } from "zod";

const AreaIndicador = z.enum([
  "VALORES",
  "PROGRAMA_EDUCATIVO",
  "RECURSOS_HUMANOS",
  "GESTAO",
  "FINANCAS",
  "CRESCIMENTO",
]);

export const IndicadorSchema = z.object({
  id: z.string().length(3),
  pergunta: z.string(),
  area: AreaIndicador,
});
