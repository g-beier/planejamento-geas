import { z } from "zod";

export const StatusAvaliacao = z.enum(["SIM", "EM_PARTE", "NAO"]);

export const DiagnosticoSchema = z.object({
  id: z.string().uuid(),
  plano_id: z.string().uuid(),
  indicador_id: z.string().length(3),
  status: StatusAvaliacao.optional(),
  justificativa: z.string().optional(),
  criado_em: z.string().datetime(),
});
