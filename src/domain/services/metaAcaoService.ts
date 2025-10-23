import { db, DBConnection } from "@/infra/db";
import { metaAcaoRepository } from "@repositories";
import { MetaAcao } from "@/types";
import { MetaAcaoSchema } from "@schemas";
import { NotFoundError, ValidationError } from "@/infra/errors";
import z from "zod";

export const metaAcaoService = (conn: DBConnection = db) => {
  const metaAcaoRepo = metaAcaoRepository(conn);

  const uuid = z.uuid();

  return {
    async criar(acao_id: string, meta_id: string): Promise<MetaAcao> {
      const parsedAcao = uuid.safeParse(acao_id);
      const parsedMeta = uuid.safeParse(meta_id);

      if (!parsedAcao.success || !parsedMeta.success) {
        throw new ValidationError("IDs inválidos para ação ou meta.");
      }

      const duplicado = await metaAcaoRepo.findByAcaoAndMetaId(
        parsedAcao.data,
        parsedMeta.data
      );

      if (duplicado) {
        throw new ValidationError("Vínculo já existente entre ação e meta.");
      }

      const created = metaAcaoRepo.create(parsedAcao.data, parsedMeta.data);
      return MetaAcaoSchema.parse(created);
    },

    async remover(acao_id: string, meta_id: string): Promise<void> {
      const parsedAcao = uuid.safeParse(acao_id);
      const parsedMeta = uuid.safeParse(meta_id);

      if (!parsedAcao.success || !parsedMeta.success) {
        throw new ValidationError("IDs inválidos para ação ou meta.");
      }

      const vinculo = await metaAcaoRepo.findByAcaoAndMetaId(
        parsedAcao.data,
        parsedMeta.data
      );

      if (!vinculo) {
        throw new NotFoundError(
          "Vínculo entre ação e responsável não encontrado."
        );
      }
      const deleted = await metaAcaoRepo.delete(
        parsedMeta.data,
        parsedAcao.data
      );
      if (!deleted) {
        throw new NotFoundError("Vínculo não encontrado.");
      }
      return;
    },
  };
};
