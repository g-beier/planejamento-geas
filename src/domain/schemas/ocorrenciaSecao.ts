import {
  AtualizaOcorrenciaSecao,
  NovoOcorrenciaSecao,
  OcorrenciaSecao,
} from "@/types";
import z from "zod";

export const OcorrenciaSecaoSchema = z.object({
  ocorrencia_id: z.uuid(),
  secao_id: z.uuid(),
  realizado: z.boolean().default(false),
  data_realizacao: z.iso.date().nullable(),
}) satisfies z.ZodType<OcorrenciaSecao>;

export const OcorrenciaCreateSchema = OcorrenciaSecaoSchema.pick({
  ocorrencia_id: true,
  secao_id: true,
}).extend({
  realizado: z.boolean().optional().default(false),
}) satisfies z.ZodType<NovoOcorrenciaSecao>;

export const OcorrenciaUpdateSchema = OcorrenciaCreateSchema.pick({
  realizado: true,
  data_realizacao: true,
}) satisfies z.ZodType<AtualizaOcorrenciaSecao>;
