import z from "zod";

export const OcorrenciaAcaoSchema = z.object({
  id: z.uuid(),
  acao_id: z.uuid(),
  referencia: z.string(),
  realizado: z.boolean().default(false),
  data_realizacao: z.iso.date().nullable(),
  observacoes: z.string().nullable(),
});

export const OcorrenciaAcaoCreateSchema = z.object({
  acao_id: z.uuid(),
  referencia: z.string(),
  realizado: z.boolean().default(false),
  data_realizacao: z.iso.date().nullable(),
  observacoes: z.string().nullable(),
});

export const OcorrenciaAcaoUpdateSchema = OcorrenciaAcaoCreateSchema.partial();
