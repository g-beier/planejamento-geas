import { z } from "zod";

export const ResponsavelSchema = z.object({
  id: z.uuid(),
  registro: z.string(),
  nome_exibicao: z.string(),
});

export const ResponsavelCreateSchema = z.object({
  registro: z
    .string()
    .regex(/\d+\-\d/, "Registro deve estar no formato XXXX-X."),
  nome_exibicao: z.string().min(1, "Nome é obrigatório"),
});

export const ResponsavelUpdateSchema = ResponsavelCreateSchema.partial();
