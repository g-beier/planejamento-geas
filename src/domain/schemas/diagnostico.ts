import { z } from "zod";

export enum StatusAvaliacaoEnum {
  SIM = "SIM",
  EM_PARTE = "EM_PARTE",
  NAO = "NAO",
}
export const StatusAvaliacao = z.enum(StatusAvaliacaoEnum);

export const DiagnosticoSchema = z.object({
  id: z.uuid(),
  plano_id: z.uuid(),
  indicador_id: z.string().length(3),
  status: StatusAvaliacao.optional(),
  justificativa: z.string().optional(),
  criado_em: z.iso.datetime(),
});

export const DiagnosticoCreateSchema = z.object({
  plano_id: z.uuid(),
  indicador_id: z.string().length(3),
  status: StatusAvaliacao.optional(),
  justificativa: z.string().optional(),
});

export const DiagnosticoUpdateSchema = DiagnosticoCreateSchema.partial();
