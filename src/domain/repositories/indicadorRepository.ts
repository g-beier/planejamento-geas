import { DB, db } from "@infra/db";
import { AreaIndicadorEnum } from "@schemas";
import { Kysely } from "kysely";

export const indicadorRepository = {
  async findAll(area?: string, trx: Kysely<DB> = db) {
    let query = trx.selectFrom("indicador").selectAll();

    if (area) {
      query = query.where("area", "=", area.toUpperCase() as AreaIndicadorEnum);
    }

    return query.execute();
  },

  async findById(id: string, trx: Kysely<DB> = db) {
    const indicador = await trx
      .selectFrom("indicador")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    return indicador ?? null;
  },
};
