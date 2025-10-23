import { NovoPlano, AtualizaPlano } from "@/types";
import { db, DBConnection } from "@infra/db";

export const planoRepository = (trx: DBConnection = db) => ({
  async findAll() {
    return trx.selectFrom("plano").selectAll().execute();
  },

  async findById(id: string) {
    const row = await trx
      .selectFrom("plano")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    return row ?? null;
  },

  async create(data: Omit<NovoPlano, "arquivado">) {
    const row = await trx
      .insertInto("plano")
      .values({
        titulo: data.titulo,
        ano: data.ano,
        arquivado: false,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return row;
  },

  async update(id: string, data: AtualizaPlano) {
    const row = await trx
      .updateTable("plano")
      .set({
        titulo: data.titulo ?? undefined,
        ano: data.ano ?? undefined,
        arquivado: data.arquivado ?? undefined,
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
    return row ?? null;
  },

  async remove(id: string) {
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
});
