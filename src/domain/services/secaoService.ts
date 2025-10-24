import { NovoSecao, AtualizaSecao } from "@types";
import { secaoRepository } from "@repositories";
import { SecaoSchema, SecaoCreateSchema, SecaoUpdateSchema } from "@schemas";
import { ValidationError } from "@/infra/errors";
import { db, DBConnection } from "@/infra/db";

export const secaoService = (conn: DBConnection = db) => {
  const secaoRepo = secaoRepository(conn);
  return {
    async listarTodos() {
      return secaoRepo.findAll();
    },

    async buscarPorId(id: string) {
      const responsavel = await secaoRepo.findById(id);
      if (!responsavel) throw new Error("Responsável não encontrado.");
      return SecaoSchema.parse(responsavel);
    },

    async criar(dados: NovoSecao) {
      const parsed = SecaoCreateSchema.safeParse(dados);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }
      const responsavel = secaoRepo.create(parsed.data);
      return responsavel;
    },

    async atualizar(id: string, dados: AtualizaSecao) {
      const parsed = SecaoUpdateSchema.safeParse(dados);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }
      const responsavel = secaoRepo.update(id, parsed.data);
      return responsavel;
    },

    async remover(id: string) {
      return secaoRepo.delete(id);
    },
  };
};
