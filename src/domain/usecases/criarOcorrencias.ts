import { DBConnection } from "@/infra/db";
import z from "zod";
import { OcorrenciaComSecoesSchema, OcorrenciaCreateSchema } from "@schemas";
import { NotFoundError, ValidationError } from "@/infra/errors";
import {
  acaoRepository,
  ocorrenciaRepository,
  ocorrenciaSecaoRepository,
  secaoRepository,
} from "@repositories";

export const criarOcorrencias = (conn: DBConnection) => {
  const acaoRepo = acaoRepository(conn);
  const secaoRepo = secaoRepository(conn);

  const InputSchema = z.object({
    acao_id: z.uuid(),
    ocorrencias: z
      .array(OcorrenciaCreateSchema.omit({ acao_id: true }))
      .nonempty("Envie ao menos uma ocorrência."),
    secoes: z.array(z.uuid()).optional(),
  });

  return {
    async executar(input: z.infer<typeof InputSchema>) {
      const parsed = InputSchema.safeParse(input);
      if (!parsed.success)
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );

      const { acao_id, ocorrencias, secoes } = parsed.data;

      const acao = await acaoRepo.findById(acao_id);
      if (!acao) throw new NotFoundError("Ação não encontrada.");

      if (secoes && secoes.length > 0) {
        const existentes = await secaoRepo.findAllByIds(secoes);
        if (existentes?.length != secoes.length) {
          throw new ValidationError("Uma ou mais seções não inválidas.");
        }
      }

      return conn.transaction().execute(async (trx) => {
        const ocTx = ocorrenciaRepository(trx);
        const ocSecTx = ocorrenciaSecaoRepository(trx);

        const payloadOcorrencias = ocorrencias.map((o) => ({
          ...o,
          acao_id,
        }));

        const criadas = await ocTx.bulkCreate(payloadOcorrencias);

        if (secoes && secoes.length > 0) {
          const payloadOcorrenciasSecao = criadas.flatMap((oc) =>
            secoes.map((secao_id) => ({
              ocorrencia_id: oc.id,
              secao_id,
              realizado: false,
            }))
          );

          return ocSecTx.bulkCreate(payloadOcorrenciasSecao);
        }

        const result: z.infer<typeof OcorrenciaComSecoesSchema>[] = secoes
          ? criadas.map((oc) =>
              OcorrenciaComSecoesSchema.parse({
                ...oc,
                secoes: secoes.map((s) => ({
                  secao_id: s,
                  realizado: false,
                })),
              })
            )
          : criadas.map((oc) => OcorrenciaComSecoesSchema.parse(oc));

        return result;
      });
    },
  };
};
