import { indicadorRepository } from "@repositories";
import { NotFoundError } from "@infra/errors";
import { AreaIndicadorEnum } from "@schemas";

export const indicadorService = {
  async listarTodos(area?: AreaIndicadorEnum) {
    return indicadorRepository.findAll(area);
  },

  async buscarPorId(id: string) {
    const indicador = await indicadorRepository.findById(id);
    if (!indicador) throw new NotFoundError("Indicador não encontrado");
    return indicador;
  },
};
