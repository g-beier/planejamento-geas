import { indicadorRepository } from "@repositories";
import { NotFoundError } from "@infra/errors";
import { AreaIndicadorEnum, IndicadorSchema } from "@schemas";
import { DBConnection, db } from "@/infra/db";

export const indicadorService = (conn: DBConnection = db) => {
  const indicadorRepo = indicadorRepository(conn);

  return {
    async listarTodos(area?: AreaIndicadorEnum) {
      return indicadorRepo.findAll(area);
    },

    async buscarPorId(id: string) {
      const indicador = await indicadorRepo.findById(id);
      if (!indicador) throw new NotFoundError("Indicador não encontrado");
      return IndicadorSchema.parse(indicador);
    },

    async buscarPorIds() {},
  };
};
