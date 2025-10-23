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

    async buscarPorId(plano_id: string, indicador_id: string) {
      const diagnostico = await diagnosticoRepo.findById(
        plano_id,
        indicador_id
      );
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

    async atualizar(plano_id: string, indicador_id: string, body: unknown) {
      const parsed = DiagnosticoUpdateSchema.safeParse(body);

      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }

      const diagnostico = await diagnosticoRepo.update(
        plano_id,
        indicador_id,
        parsed.data
      );
      if (!diagnostico) throw new NotFoundError("Diagnóstico não encontrado");

      return diagnostico;
    },

    async excluir(plano_id: string, indicador_id: string) {
      const ok = await diagnosticoRepo.delete(plano_id, indicador_id);
      if (!ok) throw new NotFoundError("Diagnóstico não encontrado");
    },
  };
};
