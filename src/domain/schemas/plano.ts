import { AtualizaPlano, NovoPlano, Plano } from "@/types";
import { z } from "zod";

export const PlanoSchema = z.object({
  id: z.uuid(),
  titulo: z
    .string()
    .min(1, "Título é obrigatório")
    .max(160, "Título muito longo"),
  ano: z.number().int().min(2000, "Ano inválido: apenas a partir de 2000"),
  criado_em: z.iso.datetime(),
  arquivado: z.boolean().default(false),
}) satisfies z.ZodType<Plano>;

export const PlanoCreateSchema = PlanoSchema.pick({
  titulo: true,
  ano: true,
}).extend({
  arquivado: z.boolean().optional().default(false),
}) satisfies z.ZodType<NovoPlano>;

export const PlanoUpdateSchema = PlanoCreateSchema.extend({
  arquivado: z.boolean().optional(),
}).partial() satisfies z.ZodType<AtualizaPlano>;
