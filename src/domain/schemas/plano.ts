import { z } from "zod";

export const PlanoSchema = z.object({
  id: z.string().uuid(),
  titulo: z.string(),
  ano: z.number().int(),
  prazo_final: z.string().date(),
  criado_em: z.string().datetime(),
});
