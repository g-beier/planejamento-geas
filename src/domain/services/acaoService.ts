import { acaoRepository } from "@repositories";
import { AcaoCreateSchema, AcaoSchema, AcaoUpdateSchema } from "@schemas";
import { Acao, AtualizaAcao, NovoAcao } from "@/types";
import { NotFoundError, ValidationError } from "@infra/errors";
import { db, DBConnection } from "@infra/db";
import z from "zod";

export const acaoService = (conn: DBConnection = db) => {
  const acaoRepo = acaoRepository(conn);

  const uuid = z.uuid();

  return {
    async listarPorPlano(planoId: string): Promise<Acao[]> {
      const parsed = uuid.safeParse(planoId);
      if (!parsed.success) {
        throw new ValidationError("ID do plano inválido.");
      }

      return acaoRepo.findByPlano(parsed.data);
    },

    async buscarPorId(id: string): Promise<Acao> {
      const parsed = uuid.safeParse(id);
      if (!parsed.success) {
        throw new ValidationError("ID da ação inválido.");
      }
      const acao = await acaoRepo.findById(parsed.data);
      if (!acao) {
        throw new NotFoundError("Ação não encontrada.");
      }

      const parsedAcao = AcaoSchema.safeParse(acao);
      if (!parsedAcao.success) {
        throw new ValidationError("Dados de ação inválidos.");
      }

      return parsedAcao.data;
    },

    async criar(data: NovoAcao): Promise<Acao> {
      const parsed = AcaoCreateSchema.safeParse(data);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }

      const created = await acaoRepo.create(parsed.data);
      return AcaoSchema.parse(created);
    },

    async atualizar(id: string, data: AtualizaAcao): Promise<Acao> {
      const parsedId = uuid.safeParse(id);
      if (!parsedId.success) {
        throw new ValidationError("ID da ação inválido.");
      }

      const parsed = AcaoUpdateSchema.safeParse(data);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }

      const existente = await acaoRepo.findById(parsedId.data);
      if (!existente) {
        throw new NotFoundError("Ação não encontrada.");
      }

      const updated = await acaoRepo.update(parsedId.data, parsed.data);
      return AcaoSchema.parse(updated);
    },

    async remover(id: string): Promise<void> {
      const parsed = uuid.safeParse(id);
      if (!parsed.success) {
        throw new ValidationError("ID da ação inválido");
      }

      const deleted = await acaoRepo.delete(parsed.data);
      if (!deleted) {
        throw new NotFoundError("Ação não encontrada.");
      }
      return;
    },
  };
};
