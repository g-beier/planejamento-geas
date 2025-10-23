import { db, DBConnection } from "@/infra/db";
import { NotFoundError } from "@/infra/errors";
import { AtualizaOcorrencia, NovoOcorencia } from "@types";

export const ocorrenciaRepository = (trx: DBConnection = db) => ({
  async findByAcao(acao_id: string) {
    return trx
      .selectFrom("ocorrencia")
      .selectAll()
      .where("acao_id", "=", acao_id)
      .execute();
  },

  async findById(id: string) {
    const ocorrencia = await trx
      .selectFrom("ocorrencia")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    if (!ocorrencia) throw new NotFoundError("Ocorrência não encontrada.");
    return ocorrencia;
  },

  async create(data: NovoOcorencia) {
    return trx
      .insertInto("ocorrencia")
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async bulkCreate(data: NovoOcorencia[]) {
    if (data.length == 0) return [];
    return trx.insertInto("ocorrencia").values(data).returningAll().execute();
  },

  async update(id: string, data: AtualizaOcorrencia) {
    const result = await trx
      .updateTable("ocorrencia")
      .set(data)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
    if (!result)
      throw new NotFoundError("Ocorrência não encontrada para atualização.");

    return result;
  },

  async delete(id: string) {
    const res = await trx
      .deleteFrom("ocorrencia")
      .where("id", "=", id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);

    return count > 0;
  },
});
