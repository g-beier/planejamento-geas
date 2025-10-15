import { planoRepository } from "@/domain/repositories/planoRepository";
import { PlanoCreateInput, PlanoUpdateInput } from "@/types/plano";
import { NotFoundError, ValidationError } from "@/infra/errors";

export const planoService = {
  async listarTodos() {
    return planoRepository.findAll();
  },

  async buscarPorId(id: string) {
    const plano = await planoRepository.findById(id);
    if (!plano) throw new NotFoundError("Plano não encontrado");
    return plano;
  },

  async criar(dados: PlanoCreateInput) {
    if (!dados.titulo || !dados.ano || !dados.prazo_final) {
      throw new ValidationError("Campos obrigatórios ausentes");
    }

    const plano = await planoRepository.create(dados);
    return plano;
  },

  async atualizar(id: string, dados: PlanoUpdateInput) {
    const plano = await planoRepository.update(id, dados);
    if (!plano) throw new NotFoundError("Plano não encontrado");
    return plano;
  },

  async remover(id: string) {
    const ok = await planoRepository.remove(id);
    if (!ok) throw new NotFoundError("Plano não encontrado");
  },
};
