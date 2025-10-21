import { AtualizaOcorrenciaAcao, NovoOcorrenciaAcao } from "@types";
import {
  OcorrenciaAcaoCreateSchema,
  OcorrenciaAcaoSchema,
  OcorrenciaAcaoUpdateSchema,
} from "@schemas";
import { NotFoundError, ValidationError } from "@infra/errors";
import { acaoRepository, ocorrenciaAcaoRepository } from "@repositories";
import { DBConnection, db } from "@/infra/db";

export const ocorrenciaAcaoService = (conn: DBConnection = db) => {
  const acaoRepo = acaoRepository(conn);
  const ocorrenciaAcaoRepo = ocorrenciaAcaoRepository(conn);

  return {
    async listarPorAcao(acao_id: string) {
      return ocorrenciaAcaoRepo.findByAcao(acao_id);
    },

    async buscarPorId(id: string) {
      const ocorrenciaAcao = ocorrenciaAcaoRepo.findById(id);
      if (!ocorrenciaAcao)
        throw new NotFoundError("Ocorrência não encontrada.");
      return OcorrenciaAcaoSchema.parse(ocorrenciaAcao);
    },

    async criar(data: NovoOcorrenciaAcao) {
      const parsed = OcorrenciaAcaoCreateSchema.safeParse(data);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }

      const acao = await acaoRepo.findById(parsed.data.acao_id);
      if (!acao) {
        throw new NotFoundError("Ação não encontrada.");
      }

      const ocorrencia = await ocorrenciaAcaoRepo.create(parsed.data);
      return ocorrencia;
    },

    async atualizar(id: string, data: AtualizaOcorrenciaAcao) {
      const parsed = OcorrenciaAcaoUpdateSchema.safeParse(data);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }

      const ocorrencia = ocorrenciaAcaoRepo.update(id, parsed.data);
      return ocorrencia;
    },

    async remover(id: string) {
      return ocorrenciaAcaoRepo.delete(id);
    },
  };
};
