import { AtualizaResponsavel, NovoResponsavel, Responsavel } from "@/types";
import { z } from "zod";

export const ResponsavelSchema = z.object({
  id: z.uuid(),
  nome: z.string(),
}) satisfies z.ZodType<Responsavel>;

export const ResponsavelCreateSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
}) satisfies z.ZodType<NovoResponsavel>;

export const ResponsavelUpdateSchema =
  ResponsavelCreateSchema.partial() satisfies z.ZodType<AtualizaResponsavel>;
