import { db, DBConnection } from "@/infra/db";
import { Responsavel, NovoResponsavel, AtualizaResponsavel } from "@types";

export const responsavelRepository = (trx: DBConnection = db) => ({
  async findAll() {
    return trx.selectFrom("responsavel").selectAll().execute();
  },
  async findById(id: string): Promise<Responsavel | null> {
    const row = await trx
      .selectFrom("responsavel")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    return row ?? null;
  },
  async create(data: NovoResponsavel) {
    const row = await trx
      .insertInto("responsavel")
      .values({
        nome_exibicao: data.nome_exibicao,
        registro: data.registro,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return row;
  },
  async update(id: string, data: AtualizaResponsavel) {
    const row = await trx
      .updateTable("responsavel")
      .set({
        nome_exibicao: data.nome_exibicao,
        registro: data.registro,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return row;
  },
  async delete(id: string) {
    const res = await trx
      .deleteFrom("responsavel")
      .where("id", "=", id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);
    return count > 0;
  },
});
