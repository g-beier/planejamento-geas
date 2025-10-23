import { db, DBConnection } from "@/infra/db";
import { AtualizaDiagnostico, NovoDiagnostico } from "@/types";

export const diagnosticoRepository = (trx: DBConnection = db) => ({
  async findByPlano(planoId: string) {
    return trx
      .selectFrom("diagnostico")
      .selectAll()
      .where("plano_id", "=", planoId)
      .orderBy("criado_em", "asc")
      .execute();
  },

  async findById(plano_id: string, indicador_id: string) {
    return trx
      .selectFrom("diagnostico")
      .selectAll()
      .where("plano_id", "=", plano_id)
      .where("indicador_id", "=", indicador_id)
      .executeTakeFirst();
  },

  async create(data: NovoDiagnostico) {
    const [novo] = await trx
      .insertInto("diagnostico")
      .values(data)
      .returningAll()
      .execute();
    return novo;
  },

  async update(
    plano_id: string,
    indicador_id: string,
    data: AtualizaDiagnostico
  ) {
    const [atualizado] = await trx
      .updateTable("diagnostico")
      .set(data)
      .where("plano_id", "=", plano_id)
      .where("indicador_id", "=", indicador_id)
      .returningAll()
      .execute();
    return atualizado;
  },

  async delete(plano_id: string, indicador_id: string) {
    const res = await trx
      .deleteFrom("diagnostico")
      .where("plano_id", "=", plano_id)
      .where("indicador_id", "=", indicador_id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);

    return count > 0;
  },
});
