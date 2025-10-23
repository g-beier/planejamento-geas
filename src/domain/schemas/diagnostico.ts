import { DiagnosticoResposta } from "@/infra/tables";
import { AtualizaDiagnostico, Diagnostico, NovoDiagnostico } from "@/types";
import { z } from "zod";

export enum DiagnosticoRespostaEnum {
  SIM = "SIM",
  EM_PARTE = "EM_PARTE",
  NAO = "NAO",
}
export const DiagnosticoRespostaSchema = z.enum(
  DiagnosticoRespostaEnum
) satisfies z.ZodType<DiagnosticoResposta>;

export const DiagnosticoSchema = z.object({
  plano_id: z.uuid(),
  indicador_id: z.string().length(3),
  resposta: DiagnosticoRespostaSchema.nullable(),
  justificativa: z.string().nullable(),
  criado_em: z.iso.datetime(),
  atualizado_em: z.iso.datetime(),
}) satisfies z.ZodType<Diagnostico>;

export const DiagnosticoCreateSchema = DiagnosticoSchema.pick({
  plano_id: true,
  indicador_id: true,
}).extend({
  justificativa: z.string().nullable().optional(),
  resposta: DiagnosticoRespostaSchema.nullable().optional(),
}) satisfies z.ZodType<NovoDiagnostico>;

export const DiagnosticoUpdateSchema = DiagnosticoSchema.pick({
  resposta: true,
  justificativa: true,
}).partial() satisfies z.ZodType<AtualizaDiagnostico>;
