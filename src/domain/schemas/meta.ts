import { AtualizaMeta, Meta, NovoMeta } from "@/types";
import { z } from "zod";

export const MetaSchema = z.object({
  id: z.uuid(),
  plano_id: z.uuid(),
  descricao: z.string(),
}) satisfies z.ZodType<Meta>;

export const MetaCreateSchema = MetaSchema.pick({
  plano_id: true,
  descricao: true,
}) satisfies z.ZodType<NovoMeta>;

export const MetaUpdateSchema = MetaCreateSchema.pick({
  descricao: true,
}) satisfies z.ZodType<AtualizaMeta>;
