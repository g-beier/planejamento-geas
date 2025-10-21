import { DB, db } from "@/infra/db";
import { AtualizaDiagnostico, NovoDiagnostico } from "@/types";
import { Kysely } from "kysely";

export const diagnosticoRepository = {
  async findByPlano(planoId: string, trx: Kysely<DB> = db) {
    return trx
      .selectFrom("diagnostico")
      .selectAll()
      .where("plano_id", "=", planoId)
      .orderBy("criado_em", "asc")
      .execute();
  },

  async findById(id: string, trx: Kysely<DB> = db) {
    return trx
      .selectFrom("diagnostico")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  },

  async create(data: NovoDiagnostico, trx: Kysely<DB> = db) {
    const [novo] = await trx
      .insertInto("diagnostico")
      .values(data)
      .returningAll()
      .execute();
    return novo;
  },

  async update(id: string, data: AtualizaDiagnostico, trx: Kysely<DB> = db) {
    const [atualizado] = await trx
      .updateTable("diagnostico")
      .set(data)
      .where("id", "=", id)
      .returningAll()
      .execute();
    return atualizado;
  },

  async delete(id: string, trx: Kysely<DB> = db) {
    const res = await trx
      .deleteFrom("diagnostico")
      .where("id", "=", id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);

    return count > 0;
  },
};
