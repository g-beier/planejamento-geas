import { z } from "zod";

export const MetaSchema = z.object({
  id: z.string().uuid(),
  diagnostico_id: z.string().uuid(),
  descricao: z.string(),
  valor_alvo: z.string().optional(),
  unidade: z.string().optional(),
  prazo: z.string().date().optional(),
});
