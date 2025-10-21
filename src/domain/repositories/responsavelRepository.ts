import { DB, db } from "@/infra/db";
import { Responsavel, NovoResponsavel, AtualizaResponsavel } from "@types";
import { Kysely } from "kysely";

export const responsavelRepository = {
  async findAll(trx: Kysely<DB> = db) {
    return trx.selectFrom("responsavel").selectAll().execute();
  },
  async findById(
    id: string,
    trx: Kysely<DB> = db
  ): Promise<Responsavel | null> {
    const row = await trx
      .selectFrom("responsavel")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    return row ?? null;
  },
  async create(data: NovoResponsavel, trx: Kysely<DB> = db) {
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
  async update(id: string, data: AtualizaResponsavel, trx: Kysely<DB> = db) {
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
  async delete(id: string, trx: Kysely<DB> = db) {
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
};
