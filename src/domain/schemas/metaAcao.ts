import z from "zod";

export const MetaAcaoSchema = z.object({
  acao_id: z.uuid(),
  meta_id: z.uuid(),
});
