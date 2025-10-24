import { db, DBConnection } from "@/infra/db";
import { NovoOcorrencia, NovoOcorrenciaSecao } from "@/types";

export const ocorrenciaSecaoRepository = (trx: DBConnection = db) => ({
  async findAllByOcorrencia(ocorrencia_id: string) {
    return trx
      .selectFrom("ocorrencia_secao")
      .selectAll()
      .where("ocorrencia_id", "=", ocorrencia_id)
      .execute();
  },

  async findByOcorrenciaAndSecao(ocorrencia_id: string, secao_id: string) {
    return trx
      .selectFrom("ocorrencia_secao")
      .selectAll()
      .where("ocorrencia_id", "=", ocorrencia_id)
      .where("secao_id", "=", secao_id)
      .executeTakeFirst();
  },

  async create(ocorrencia_id: string, secao_id: string) {
    return trx
      .insertInto("ocorrencia_secao")
      .values({ ocorrencia_id, secao_id, realizado: false })
      .executeTakeFirstOrThrow();
  },

  async bulkCreate(data: NovoOcorrenciaSecao[]) {
    if (data.length == 0) return [];
    return trx
      .insertInto("ocorrencia_secao")
      .values(data)
      .returningAll()
      .execute();
  },

  async delete(ocorrencia_id: string, secao_id: string) {
    const res = await trx
      .deleteFrom("ocorrencia_secao")
      .where("secao_id", "=", secao_id)
      .where("ocorrencia_id", "=", ocorrencia_id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);

    return count > 0;
  },
});
