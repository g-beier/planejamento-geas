import { z } from "zod";

export const ResponsavelSchema = z.object({
  id: z.string().uuid(),
  registro: z.string(),
  nome_exibicao: z.string(),
});
