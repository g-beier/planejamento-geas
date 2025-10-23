import { IndicadorArea } from "@/infra/tables";
import { Indicador } from "@/types";
import { z } from "zod";

export enum AreaIndicadorEnum {
  VALORES = "VALORES",
  PROGRAMA_EDUCATIVO = "PROGRAMA_EDUCATIVO",
  RECURSOS_HUMANOS = "RECURSOS_HUMANOS",
  GESTAO = "GESTAO",
  FINANCAS = "FINANCAS",
  CRESCIMENTO = "CRESCIMENTO",
}
const AreaIndicadorSchema = z.enum(
  AreaIndicadorEnum
) satisfies z.ZodType<IndicadorArea>;

export const IndicadorSchema = z.object({
  id: z.string().length(3),
  pergunta: z.string(),
  area: AreaIndicadorSchema,
  atualizado_em: z.iso.datetime(),
}) satisfies z.ZodType<Indicador>;
