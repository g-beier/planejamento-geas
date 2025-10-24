import { db, DBConnection } from "@/infra/db";
import { Secao, NovoSecao, AtualizaSecao } from "@types";

export const secaoRepository = (trx: DBConnection = db) => ({
  async findAll() {
    return trx.selectFrom("secao").selectAll().execute();
  },
  async findById(id: string): Promise<Secao | null> {
    const row = await trx
      .selectFrom("secao")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    return row ?? null;
  },
  async findAllByIds(ids: string[]): Promise<Secao[] | null> {
    const rows = await trx
      .selectFrom("secao")
      .selectAll()
      .where("id", "in", ids)
      .execute();
    return rows ?? null;
  },
  async create(data: NovoSecao) {
    const row = await trx
      .insertInto("secao")
      .values({
        nome: data.nome,
        ramo: data.ramo,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return row;
  },
  async update(id: string, data: AtualizaSecao) {
    const row = await trx
      .updateTable("secao")
      .set({
        nome: data.nome,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return row;
  },
  async delete(id: string) {
    const res = await trx
      .deleteFrom("secao")
      .where("id", "=", id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);
    return count > 0;
  },
});
