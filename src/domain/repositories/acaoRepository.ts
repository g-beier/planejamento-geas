import { db } from "@/infra/db";
import { NotFoundError } from "@/infra/errors";
import { AtualizaAcao, NovoAcao } from "@/types";

export const acaoRepository = {
  async findByPlano(planoId: string) {
    return db
      .selectFrom("acao")
      .selectAll()
      .where("plano_id", "=", planoId)
      .execute();
  },

  async findById(id: string) {
    const acao = await db
      .selectFrom("acao")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    if (!acao) throw new NotFoundError("Ação não encontrada");
    return acao;
  },

  async create(data: NovoAcao) {
    return db
      .insertInto("acao")
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async update(id: string, data: AtualizaAcao) {
    const result = await db
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
    const result = await db
      .deleteFrom("acao")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
    if (!result) throw new NotFoundError("Ação não encontrada para exclusão");
    return result;
  },
};
