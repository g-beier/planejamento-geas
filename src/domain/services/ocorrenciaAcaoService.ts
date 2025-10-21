import { AtualizaOcorrenciaAcao, NovoOcorrenciaAcao } from "@types";
import {
  OcorrenciaAcaoCreateSchema,
  OcorrenciaAcaoUpdateSchema,
} from "@schemas";
import { NotFoundError, ValidationError } from "@infra/errors";
import { acaoRepository, ocorrenciaAcaoRepository } from "@repositories";

export const ocorrenciaAcaoService = {
  async listarPorAcao(acao_id: string) {
    return ocorrenciaAcaoRepository.findByAcao(acao_id);
  },

  async buscarPorId(id: string) {
    return ocorrenciaAcaoRepository.findById(id);
  },

  async criar(data: NovoOcorrenciaAcao) {
    const parsed = OcorrenciaAcaoCreateSchema.safeParse(data);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues.map((e) => e.message).join(", ")
      );
    }

    const acao = await acaoRepository.findById(parsed.data.acao_id);
    if (!acao) {
      throw new NotFoundError("Ação não encontrada.");
    }

    const ocorrencia = await ocorrenciaAcaoRepository.create(parsed.data);
    return ocorrencia;
  },

  async atualizar(id: string, data: AtualizaOcorrenciaAcao) {
    const parsed = OcorrenciaAcaoUpdateSchema.safeParse(data);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues.map((e) => e.message).join(", ")
      );
    }

    const ocorrencia = ocorrenciaAcaoRepository.update(id, parsed.data);
    return ocorrencia;
  },

  async remover(id: string) {
    return ocorrenciaAcaoRepository.delete(id);
  },
};
