import { indicadorRepository } from "@/domain/repositories/indicadorRepository";
import { AreaIndicador } from "@/types/indicador";
import { NotFoundError } from "@/infra/errors";

export const indicadorService = {
  async listarTodos(area?: AreaIndicador) {
    return indicadorRepository.findAll(area);
  },

  async buscarPorId(id: string) {
    const indicador = await indicadorRepository.findById(id);
    if (!indicador) throw new NotFoundError("Indicador não encontrado");
    return indicador;
  },
};
