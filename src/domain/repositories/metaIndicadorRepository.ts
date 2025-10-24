import { db, DBConnection } from "@/infra/db";

export const metaIndicadorRepository = (trx: DBConnection = db) => ({
  async findAllByIndicador(indicador_id: string) {
    return trx
      .selectFrom("meta_indicador")
      .selectAll()
      .where("indicador_id", "=", indicador_id)
      .execute();
  },

  async findAllByMeta(meta_id: string) {
    return trx
      .selectFrom("meta_indicador")
      .selectAll()
      .where("meta_id", "=", meta_id)
      .execute();
  },

  async findByMetaAndIndicador(meta_id: string, indicador_id: string) {
    return trx
      .selectFrom("meta_indicador")
      .selectAll()
      .where("indicador_id", "=", indicador_id)
      .where("meta_id", "=", meta_id)
      .executeTakeFirst();
  },

  async create(meta_id: string, indicador_id: string) {
    return trx
      .insertInto("meta_indicador")
      .values({ indicador_id, meta_id })
      .executeTakeFirstOrThrow();
  },

  async delete(meta_id: string, indicador_id: string) {
    const res = await trx
      .deleteFrom("meta_indicador")
      .where("meta_id", "=", meta_id)
      .where("indicador_id", "=", indicador_id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);

    return count > 0;
  },
});
