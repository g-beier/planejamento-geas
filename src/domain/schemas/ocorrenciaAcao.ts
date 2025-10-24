import { AtualizaOcorrencia, NovoOcorrencia, Ocorrencia } from "@/types";
import z from "zod";
import { OcorrenciaSecaoSchema } from "./ocorrenciaSecao";

export const OcorrenciaSchema = z.object({
  id: z.uuid(),
  acao_id: z.uuid(),
  descricao: z.string(),
  realizado: z.boolean().default(false),
  data_realizacao: z.iso.date().nullable(),
  criado_em: z.iso.datetime(),
  atualizado_por: z.string(),
  ordem: z.number().int(),
}) satisfies z.ZodType<Ocorrencia>;

export const OcorrenciaCreateSchema = OcorrenciaSchema.pick({
  acao_id: true,
  descricao: true,
  ordem: true,
}).extend({
  realizado: z.boolean().optional().default(false),
}) satisfies z.ZodType<NovoOcorrencia>;

export const OcorrenciaUpdateSchema = OcorrenciaCreateSchema.pick({
  descricao: true,
  realizado: true,
  data_realizacao: true,
  ordem: true,
}) satisfies z.ZodType<AtualizaOcorrencia>;

export const OcorrenciaComSecoesSchema = OcorrenciaSchema.extend({
  secoes: z
    .array(
      OcorrenciaSecaoSchema.pick({
        secao_id: true,
        realizado: true,
        data_realizacao: true,
      })
    )
    .optional(),
});
