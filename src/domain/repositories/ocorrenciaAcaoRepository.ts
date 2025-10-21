import { db, DB } from "@/infra/db";
import { NotFoundError } from "@/infra/errors";
import { AtualizaOcorrenciaAcao, NovoOcorrenciaAcao } from "@types";
import { Kysely } from "kysely";

export const ocorrenciaAcaoRepository = {
  async findByAcao(acao_id: string, trx: Kysely<DB> = db) {
    return trx
      .selectFrom("ocorrencia_acao")
      .selectAll()
      .where("acao_id", "=", acao_id)
      .execute();
  },

  async findById(id: string, trx: Kysely<DB> = db) {
    const ocorrencia = await trx
      .selectFrom("ocorrencia_acao")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    if (!ocorrencia) throw new NotFoundError("Ocorrência não encontrada.");
  },

  async create(data: NovoOcorrenciaAcao, trx: Kysely<DB> = db) {
    return trx
      .insertInto("ocorrencia_acao")
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async update(id: string, data: AtualizaOcorrenciaAcao, trx: Kysely<DB> = db) {
    const result = await trx
      .updateTable("ocorrencia_acao")
      .set(data)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
    if (!result)
      throw new NotFoundError("Ocorrência não encontrada para atualização.");

    return result;
  },

  async delete(id: string, trx: Kysely<DB> = db) {
    const res = await trx
      .deleteFrom("ocorrencia_acao")
      .where("id", "=", id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);

    return count > 0;
  },
};
