import { db, DBConnection } from "@infra/db";
import { AreaIndicadorEnum } from "@schemas";

export const indicadorRepository = (trx: DBConnection = db) => ({
  async findAll(area?: string) {
    let query = trx.selectFrom("indicador").selectAll();

    if (area) {
      query = query.where("area", "=", area.toUpperCase() as AreaIndicadorEnum);
    }

    return query.execute();
  },

  async findById(id: string) {
    const indicador = await trx
      .selectFrom("indicador")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    return indicador ?? null;
  },
});
