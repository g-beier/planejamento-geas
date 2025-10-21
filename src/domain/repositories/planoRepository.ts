import { NovoPlano, AtualizaPlano } from "@/types";
import { DB, db } from "@infra/db";
import { Kysely } from "kysely";

export const planoRepository = {
  async findAll(trx: Kysely<DB> = db) {
    return trx.selectFrom("plano").selectAll().execute();
  },

  async findById(id: string, trx: Kysely<DB> = db) {
    const row = await trx
      .selectFrom("plano")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    return row ?? null;
  },

  async create(data: NovoPlano, trx: Kysely<DB> = db) {
    const row = await trx
      .insertInto("plano")
      .values({
        titulo: data.titulo,
        ano: data.ano,
        prazo_final: data.prazo_final,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return row;
  },

  async update(id: string, data: AtualizaPlano, trx: Kysely<DB> = db) {
    const row = await trx
      .updateTable("plano")
      .set({
        titulo: data.titulo ?? undefined,
        ano: data.ano ?? undefined,
        prazo_final: data.prazo_final ?? undefined,
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
    return row ?? null;
  },

  async remove(id: string, trx: Kysely<DB> = db) {
    const res = await trx
      .deleteFrom("plano")
      .where("id", "=", id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);
    return count > 0;
  },
};
