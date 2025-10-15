import { z } from "zod";

const TipoAcao = z.enum(["DATA_FIXA", "PRAZO_FLEXIVEL"]);

const TipoAgendamento = z.enum(["UNICO", "RECORRENTE", "CICLO"]);

export const AcaoSchema = z.object({
  id: z.string().uuid(),
  plano_id: z.string().uuid(),
  descricao: z.string(),
  tipo: TipoAcao,
});

export const AcaoDiagnosticoSchema = z.object({
  id: z.string().uuid(),
  acao_id: z.string().uuid(),
  diagnostico_id: z.string().uuid(),
});

export const AcaoResponsavelSchema = z.object({
  id: z.string().uuid(),
  acao_id: z.string().uuid(),
  responsavel_id: z.string().uuid(),
});

export const AgendamentoAcaoSchema = z.object({
  id: z.string().uuid(),
  acao_id: z.string().uuid(),
  tipo: TipoAgendamento,
  descricao: z.string().nullable(),
  data_fixa: z.string().date().nullable(),
  ciclo: z.number().int().nullable(),
  intervalo: z.string().nullable(),
});

export const OcorrenciaAcaoSchema = z.object({
  id: z.string().uuid(),
  agendamento_id: z.string().uuid(),
  data_planejada: z.string().date(),
  realizado: z.boolean().default(false),
  data_realizacao: z.string().date().nullable(),
  observacoes: z.string().nullable(),
  atualizado_por: z.string().uuid().nullable(),
});
