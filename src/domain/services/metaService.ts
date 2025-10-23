import { metaRepository } from "@repositories";
import { NotFoundError, ValidationError } from "@infra/errors";
import { MetaCreateSchema, MetaUpdateSchema } from "@schemas";
import { DBConnection, db } from "@/infra/db";

export const metaService = (conn: DBConnection = db) => {
  const metaRepo = metaRepository(conn);

  return {
    async listarTodos() {
      return metaRepo.findAll();
    },

    async buscarPorId(id: string) {
      const meta = await metaRepo.findById(id);
      if (!meta) throw new NotFoundError("Meta não encontrada.");
      return meta;
    },

    async criar(body: unknown) {
      const parsed = MetaCreateSchema.safeParse(body);

      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }

      const meta = await metaRepo.create(parsed.data);
      return meta;
    },

    async atualizar(id: string, body: unknown) {
      const parsed = MetaUpdateSchema.safeParse(body);

      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }

      const meta = await metaRepo.update(id, parsed.data);
      if (!meta) throw new NotFoundError("Meta não encontrada.");
      return meta;
    },

    async remover(id: string) {
      const ok = await metaRepo.delete(id);
      if (!ok) throw new NotFoundError("Meta não encontrada.");
    },
  };
};
