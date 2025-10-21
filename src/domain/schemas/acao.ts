import { z } from "zod";

export const AcaoSchema = z.object({
  id: z.uuid(),
  plano_id: z.uuid(),
  descricao: z.string(),
  frequencia: z.string(),
});

export const AcaoCreateSchema = z.object({
  plano_id: z.uuid(),
  diagnostico_id: z.uuid(),
  descricao: z.string(),
  frequencia: z.string(),
});

export const AcaoUpdateSchema = z
  .object({
    descricao: z.string(),
    frequencia: z.string(),
  })
  .partial();

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
