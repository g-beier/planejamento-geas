import { DBConnection } from "@/infra/db";
import {
  acaoRepository,
  acaoResponsavelRepository,
  responsavelRepository,
} from "@repositories";
import z from "zod";
import { ConflictError, NotFoundError, ValidationError } from "@/infra/errors";

export const vincularResponsavelAcao = (conn: DBConnection) => {
  const acaoRepo = acaoRepository(conn);
  const responsavelRepo = responsavelRepository(conn);
  const acaoRespRepo = acaoResponsavelRepository(conn);

  const uuid = z.uuid();

  return {
    async adicionarResponsavel(acao_id: string, responsavel_id: string) {
      const parsedAcao = uuid.safeParse(acao_id);
      const parsedResp = uuid.safeParse(responsavel_id);

      if (!parsedAcao.success || !parsedResp.success) {
        throw new ValidationError("IDs inválidos para ação ou responsável.");
      }
      const [acao, responsavel] = await Promise.all([
        acaoRepo.findById(parsedAcao.data),
        responsavelRepo.findById(parsedResp.data),
      ]);

      if (!acao) {
        throw new NotFoundError("Ação não encontrada.");
      }
      if (!responsavel) {
        throw new NotFoundError("Responsável não encontrado.");
      }

      const duplicado = await acaoRespRepo.findByAcaoAndResponsavel(
        acao_id,
        responsavel_id
      );

      if (duplicado) {
        throw new ConflictError("Responsável já está vinculado a esta ação.");
      }

      const vinculo = await conn.transaction().execute(async (trx) => {
        const repoTx = acaoResponsavelRepository(trx);
        return repoTx.create(parsedAcao.data, parsedResp.data);
      });

      return vinculo;
    },
  };
};
