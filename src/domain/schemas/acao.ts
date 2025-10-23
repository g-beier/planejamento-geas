import { Acao, AtualizaAcao, NovoAcao } from "@/types";
import { z } from "zod";

export const AcaoSchema = z.object({
  id: z.uuid(),
  plano_id: z.uuid(),
  descricao: z.string(),
  frequencia: z.string(),
  criado_em: z.iso.datetime(),
  atualizado_em: z.iso.datetime(),
}) satisfies z.ZodType<Acao>;

export const AcaoCreateSchema = z.object({
  plano_id: z.uuid(),
  descricao: z.string(),
  frequencia: z.string(),
}) satisfies z.ZodType<NovoAcao>;

export const AcaoUpdateSchema = z
  .object({
    descricao: z.string(),
    frequencia: z.string(),
  })
  .partial() satisfies z.ZodType<AtualizaAcao>;
