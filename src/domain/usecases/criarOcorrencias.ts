import { DBConnection } from "@/infra/db";
import z from "zod";
import { OcorrenciaCreateSchema } from "../schemas";
import { NotFoundError, ValidationError } from "@/infra/errors";
import { acaoRepository, ocorrenciaRepository } from "../repositories";

export const criarOcorrencias = (conn: DBConnection) => {
  const acaoRepo = acaoRepository(conn);
  const InputSchema = z.object({
    acao_id: z.uuid(),
    ocorrencias: z
      .array(OcorrenciaCreateSchema.omit({ acao_id: true }))
      .nonempty("Envie ao menos uma ocorrência."),
  });
  return {
    async executar(input: z.infer<typeof InputSchema>) {
      const parsed = InputSchema.safeParse(input);
      if (!parsed.success)
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );

      const { acao_id, ocorrencias } = parsed.data;

      const acao = await acaoRepo.findById(acao_id);
      if (!acao) throw new NotFoundError("Ação não encontrada.");

      return conn.transaction().execute(async (trx) => {
        const ocTx = ocorrenciaRepository(trx);
        const payload = ocorrencias.map((o) => ({
          ...o,
          acao_id,
        }));
        return ocTx.bulkCreate(payload);
      });
    },
  };
};
