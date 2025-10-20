import { z } from "zod";

export const PlanoSchema = z.object({
  id: z.uuid(),
  titulo: z.string(),
  ano: z.number().int(),
  prazo_final: z.iso.date(),
  criado_em: z.iso.datetime(),
});

export const PlanoCreateSchema = z.object({
  titulo: z
    .string()
    .min(1, "Título é obrigatório")
    .max(160, "Título muito longo"),
  ano: z.number().int().min(2000, "Ano inválido: apenas a partir de 2000"),
  prazo_final: z.iso.date("Deve ser uma data válida no formato YYYY-MM-DD"),
});

export const PlanoUpdateSchema = PlanoCreateSchema.partial();
