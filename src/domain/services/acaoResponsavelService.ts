import { AcaoResponsavel } from "@/types";
import { acaoResponsavelRepository } from "@repositories";
import { AcaoResponsavelSchema } from "@schemas";
import { DBConnection, db } from "@/infra/db";
import { NotFoundError, ValidationError } from "@/infra/errors";
import z from "zod";

export const acaoResponsavelService = (conn: DBConnection = db) => {
  const acaoRespRepo = acaoResponsavelRepository(conn);
  const uuid = z.uuid();

  return {
    async criar(
      acao_id: string,
      responsavel_id: string
    ): Promise<AcaoResponsavel> {
      const parsedAcao = uuid.safeParse(acao_id);
      const parsedResp = uuid.safeParse(responsavel_id);

      if (!parsedAcao.success || !parsedResp.success) {
        throw new ValidationError("IDs inválidos para ação ou responsável.");
      }

      const duplicado = await acaoRespRepo.findByAcaoAndResponsavelId(
        parsedAcao.data,
        parsedResp.data
      );

      if (duplicado) {
        throw new ValidationError(
          "Vínculo já existente entre ação e responsável."
        );
      }

      const created = acaoRespRepo.create(parsedAcao.data, parsedResp.data);
      return AcaoResponsavelSchema.parse(created);
    },
    async remover(acao_id: string, responsavel_id: string): Promise<void> {
      const parsedAcao = uuid.safeParse(acao_id);
      const parsedResp = uuid.safeParse(responsavel_id);

      if (!parsedAcao.success || !parsedResp.success) {
        throw new ValidationError("IDs inválidos para ação ou responsável.");
      }

      const vinculo = await acaoRespRepo.findByAcaoAndResponsavelId(
        parsedAcao.data,
        parsedResp.data
      );

      if (!vinculo) {
        throw new NotFoundError(
          "Vínculo entre ação e responsável não encontrado."
        );
      }
      const deleted = await acaoRespRepo.delete(vinculo.id);
      if (!deleted) {
        throw new NotFoundError("Vínculo não encontrado.");
      }
      return;
    },
  };
};

/**
    async adicionarResponsavel
 */
