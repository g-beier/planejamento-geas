import { db, DBConnection } from "@/infra/db";
import { NotFoundError } from "@/infra/errors";
import { AtualizaAcao, NovoAcao } from "@/types";

export const acaoRepository = (trx: DBConnection = db) => ({
  async findByPlano(planoId: string) {
    return trx
      .selectFrom("acao")
      .selectAll()
      .where("plano_id", "=", planoId)
      .execute();
  },

  async findById(id: string) {
    const acao = await trx
      .selectFrom("acao")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    if (!acao) throw new NotFoundError("Ação não encontrada");
    return acao;
  },

  async create(data: NovoAcao) {
    return trx
      .insertInto("acao")
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async update(id: string, data: AtualizaAcao) {
    const result = await trx
      .updateTable("acao")
      .set(data)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
    if (!result)
      throw new NotFoundError("Ação não encontrada para atualização");
    return result;
  },

  async delete(id: string) {
    const res = await trx
      .deleteFrom("acao")
      .where("id", "=", id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);

    return count > 0;
  },
});
