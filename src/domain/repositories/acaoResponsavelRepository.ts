import { db, DBConnection } from "@/infra/db";

export const acaoResponsavelRepository = (trx: DBConnection = db) => ({
  async findAllByAcao(acao_id: string) {
    return trx
      .selectFrom("acao_responsavel")
      .selectAll()
      .where("acao_id", "=", acao_id)
      .execute();
  },

  async findByAcaoAndResponsavelId(acao_id: string, responsavel_id: string) {
    return trx
      .selectFrom("acao_responsavel")
      .selectAll()
      .where("acao_id", "=", acao_id)
      .where("responsavel_id", "=", responsavel_id)
      .executeTakeFirst();
  },

  async create(acao_id: string, responsavel_id: string) {
    return trx
      .insertInto("acao_responsavel")
      .values({ acao_id, responsavel_id })
      .executeTakeFirstOrThrow();
  },

  async delete(id: string) {
    const res = await trx
      .deleteFrom("acao_responsavel")
      .where("id", "=", id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);

    return count > 0;
  },
});
