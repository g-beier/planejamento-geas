import { AtualizaOcorrencia, NovoOcorrencia } from "@types";
import {
  OcorrenciaSchema,
  OcorrenciaCreateSchema,
  OcorrenciaUpdateSchema,
} from "@schemas";
import { NotFoundError, ValidationError } from "@infra/errors";
import { acaoRepository, ocorrenciaRepository } from "@repositories";
import { DBConnection, db } from "@/infra/db";

export const ocorrenciaService = (conn: DBConnection = db) => {
  const acaoRepo = acaoRepository(conn);
  const ocorrenciaAcaoRepo = ocorrenciaRepository(conn);

  return {
    async listarPorAcao(acao_id: string) {
      return ocorrenciaAcaoRepo.findByAcao(acao_id);
    },

    async buscarPorId(id: string) {
      const ocorrenciaAcao = ocorrenciaAcaoRepo.findById(id);
      if (!ocorrenciaAcao)
        throw new NotFoundError("Ocorrência não encontrada.");
      return OcorrenciaSchema.parse(ocorrenciaAcao);
    },

    async criar(data: NovoOcorrencia) {
      const parsed = OcorrenciaCreateSchema.safeParse(data);
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

    async atualizar(id: string, data: AtualizaOcorrencia) {
      const parsed = OcorrenciaUpdateSchema.safeParse(data);
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
