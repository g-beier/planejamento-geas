import { z } from "zod";

export const CicloProgramaSchema = z.object({
  id: z.string().uuid(),
  plano_id: z.string().uuid(),
  nome: z.string(),
  data_inicio: z.string().date(),
  data_fim: z.string().date(),
});
