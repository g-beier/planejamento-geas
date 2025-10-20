import { acaoRepository } from "@repositories/acaoRepository";
import { AcaoSchema } from "@schemas";
import { AtualizaAcao, NovoAcao } from "@/types";
import { ValidationError } from "@/infra/errors";

export const acaoService = {
  async listarPorPlano(planoId: string) {
    return acaoRepository.findByPlano(planoId);
  },

  async buscarPorId(id: string) {
    return acaoRepository.findById(id);
  },

  async criar(data: NovoAcao) {
    const parsed = AcaoSchema.safeParse(data);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues.map((e) => e.message).join(", ")
      );
    }
    const acao = acaoRepository.create(parsed.data);
    return acao;
  },

  async atualizar(id: string, data: AtualizaAcao) {
    const parsed = AcaoSchema.partial().safeParse(data);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues.map((e) => e.message).join(", ")
      );
    }
    const acao = acaoRepository.update(id, parsed.data);
    return acao;
  },

  async remover(id: string) {
    return acaoRepository.delete(id);
  },
};
