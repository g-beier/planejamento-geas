import { NovoResponsavel, AtualizaResponsavel } from "@types";
import { responsavelRepository } from "@repositories";
import {
  ResponsavelSchema,
  ResponsavelCreateSchema,
  ResponsavelUpdateSchema,
} from "../schemas/responsavel";
import { ValidationError } from "@/infra/errors";

export const responsavelService = {
  async listarTodos() {
    return responsavelRepository.findAll();
  },

  async buscarPorId(id: string) {
    const responsavel = await responsavelRepository.findById(id);
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
    const responsavel = responsavelRepository.create(parsed.data);
    return responsavel;
  },

  async atualizar(id: string, dados: AtualizaResponsavel) {
    const parsed = ResponsavelUpdateSchema.safeParse(dados);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues.map((e) => e.message).join(", ")
      );
    }
    const responsavel = responsavelRepository.update(id, parsed.data);
    return responsavel;
  },

  async remover(id: string) {
    return responsavelRepository.delete(id);
  },
};
