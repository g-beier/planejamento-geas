import { diagnosticoRepository } from "@repositories";
import { NotFoundError, ValidationError } from "@infra/errors";
import { DiagnosticoCreateSchema, DiagnosticoUpdateSchema } from "@schemas";
import { DBConnection, db } from "@/infra/db";

export const diagnosticoService = (conn: DBConnection = db) => {
  const diagnosticoRepo = diagnosticoRepository(conn);

  return {
    async listarPorPlano(planoId: string) {
      return diagnosticoRepo.findByPlano(planoId);
    },

    async buscarPorId(id: string) {
      const diagnostico = await diagnosticoRepo.findById(id);
      if (!diagnostico) throw new NotFoundError("Diagnóstico não encontrado");
      return diagnostico;
    },

    async criar(body: unknown) {
      const parsed = DiagnosticoCreateSchema.safeParse(body);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }

      const diagnostico = diagnosticoRepo.create(parsed.data);
      return diagnostico;
    },

    async atualizar(id: string, body: unknown) {
      const parsed = DiagnosticoUpdateSchema.safeParse(body);

      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }

      const diagnostico = await diagnosticoRepo.update(id, parsed.data);
      if (!diagnostico) throw new NotFoundError("Diagnóstico não encontrado");

      return diagnostico;
    },

    async excluir(id: string) {
      const ok = await diagnosticoRepo.delete(id);
      if (!ok) throw new NotFoundError("Diagnóstico não encontrado");
    },
  };
};
