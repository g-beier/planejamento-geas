import { NovoResponsavel, AtualizaResponsavel } from "@types";
import { responsavelRepository } from "@repositories";
import {
  ResponsavelSchema,
  ResponsavelCreateSchema,
  ResponsavelUpdateSchema,
} from "../schemas/responsavel";
import { ValidationError } from "@/infra/errors";
import { db, DBConnection } from "@/infra/db";

export const responsavelService = (conn: DBConnection = db) => {
  const responsavelRepo = responsavelRepository(conn);
  return {
    async listarTodos() {
      return responsavelRepo.findAll();
    },

    async buscarPorId(id: string) {
      const responsavel = await responsavelRepo.findById(id);
      if (!responsavel) throw new Error("Responsável não encontrado.");
      return ResponsavelSchema.parse(responsavel);
    },

    async criar(dados: NovoResponsavel) {
      const parsed = ResponsavelCreateSchema.safeParse(dados);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }
      const responsavel = responsavelRepo.create(parsed.data);
      return responsavel;
    },

    async atualizar(id: string, dados: AtualizaResponsavel) {
      const parsed = ResponsavelUpdateSchema.safeParse(dados);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }
      const responsavel = responsavelRepo.update(id, parsed.data);
      return responsavel;
    },

    async remover(id: string) {
      return responsavelRepo.delete(id);
    },
  };
};
