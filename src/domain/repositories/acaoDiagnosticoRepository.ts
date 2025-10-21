import { Kysely } from "kysely";
import { DB, db } from "@/infra/db";

export const acaoDiagnosticoRepository = {
  async findAllByAcaoId(acao_id: string, trx: Kysely<DB> = db) {
    return trx
      .selectFrom("acao_diagnostico")
      .selectAll()
      .where("acao_id", "=", acao_id)
      .execute();
  },

  async findAllByDiagnosticoId(diagnostico_id: string, trx: Kysely<DB> = db) {
    return trx
      .selectFrom("acao_diagnostico")
      .selectAll()
      .where("diagnostico_id", "=", diagnostico_id)
      .execute();
  },

  async findByAcaoAndDiagnosticoId(
    acao_id: string,
    diagnostico_id: string,
    trx: Kysely<DB> = db
  ) {
    return trx
      .selectFrom("acao_diagnostico")
      .selectAll()
      .where("acao_id", "=", acao_id)
      .where("diagnostico_id", "=", diagnostico_id)
      .executeTakeFirst();
  },

  async create(acao_id: string, diagnostico_id: string, trx: Kysely<DB> = db) {
    return trx
      .insertInto("acao_diagnostico")
      .values({ diagnostico_id, acao_id })
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async delete(id: string, trx: Kysely<DB> = db) {
    const res = await trx
      .deleteFrom("acao_diagnostico")
      .where("id", "=", id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);

    return count > 0;
  },
};
