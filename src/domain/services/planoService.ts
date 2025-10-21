import { planoRepository } from "@repositories";
import { NotFoundError, ValidationError } from "@infra/errors";
import { PlanoCreateSchema, PlanoUpdateSchema } from "@schemas";
import { DBConnection, db } from "@/infra/db";

export const planoService = (conn: DBConnection = db) => {
  const planoRepo = planoRepository(conn);

  return {
    async listarTodos() {
      return planoRepo.findAll();
    },

    async buscarPorId(id: string) {
      const plano = await planoRepo.findById(id);
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

      const plano = await planoRepo.create(parsed.data);
      return plano;
    },

    async atualizar(id: string, body: unknown) {
      const parsed = PlanoUpdateSchema.safeParse(body);

      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }

      const plano = await planoRepo.update(id, parsed.data);
      if (!plano) throw new NotFoundError("Plano não encontrado");
      return plano;
    },

    async remover(id: string) {
      const ok = await planoRepo.remove(id);
      if (!ok) throw new NotFoundError("Plano não encontrado");
    },
  };
};
