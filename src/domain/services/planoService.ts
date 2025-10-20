import { planoRepository } from "@repositories";
import { NotFoundError, ValidationError } from "@infra/errors";
import { PlanoCreateSchema, PlanoUpdateSchema } from "@schemas";

export const planoService = {
  async listarTodos() {
    return planoRepository.findAll();
  },

  async buscarPorId(id: string) {
    const plano = await planoRepository.findById(id);
    if (!plano) throw new NotFoundError("Plano não encontrado");
    return plano;
  },

  async criar(body: unknown) {
    const parsed = PlanoCreateSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues.map((e) => e.message).join(", ")
      );
    }

    const plano = await planoRepository.create(parsed.data);
    return plano;
  },

  async atualizar(id: string, body: unknown) {
    const parsed = PlanoUpdateSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues.map((e) => e.message).join(", ")
      );
    }

    const plano = await planoRepository.update(id, parsed.data);
    if (!plano) throw new NotFoundError("Plano não encontrado");
    return plano;
  },

  async remover(id: string) {
    const ok = await planoRepository.remove(id);
    if (!ok) throw new NotFoundError("Plano não encontrado");
  },
};
