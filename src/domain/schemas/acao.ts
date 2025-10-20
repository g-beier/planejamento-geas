import { z } from "zod";

export const AcaoSchema = z.object({
  id: z.uuid(),
  plano_id: z.uuid(),
  descricao: z.string(),
  frequencia: z.string(),
});

export const AcaoDiagnosticoSchema = z.object({
  id: z.uuid(),
  acao_id: z.uuid(),
  diagnostico_id: z.uuid(),
});

export const AcaoResponsavelSchema = z.object({
  id: z.uuid(),
  acao_id: z.uuid(),
  responsavel_id: z.uuid(),
});

export const OcorrenciaAcaoSchema = z.object({
  id: z.uuid(),
  acao_id: z.uuid(),
  referencia: z.string(),
  realizado: z.boolean().default(false),
  data_realizacao: z.iso.date().nullable(),
  observacoes: z.string().nullable(),
});
