import { db, DBConnection } from "@/infra/db";

export const metaAcaoRepository = (trx: DBConnection = db) => ({
  async findAllByAcaoId(acao_id: string) {
    return trx
      .selectFrom("meta_acao")
      .selectAll()
      .where("acao_id", "=", acao_id)
      .execute();
  },

  async findAllByMetaId(meta_id: string) {
    return trx
      .selectFrom("meta_acao")
      .selectAll()
      .where("meta_id", "=", meta_id)
      .execute();
  },

  async findByAcaoAndMetaId(acao_id: string, meta_id: string) {
    return trx
      .selectFrom("meta_acao")
      .selectAll()
      .where("acao_id", "=", acao_id)
      .where("meta_id", "=", meta_id)
      .executeTakeFirst();
  },

  async create(acao_id: string, meta_id: string) {
    return trx
      .insertInto("meta_acao")
      .values({ meta_id, acao_id })
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async delete(meta_id: string, acao_id: string) {
    const res = await trx
      .deleteFrom("meta_acao")
      .where("meta_id", "=", meta_id)
      .where("acao_id", "=", acao_id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);

    return count > 0;
  },
});
