import { db, DBConnection } from "@/infra/db";
import { NotFoundError } from "@/infra/errors";
import { AtualizaMeta, NovoMeta } from "@/types";

export const metaRepository = (trx: DBConnection = db) => ({
  async findByPlano(plano_id: string) {
    const meta = await trx
      .selectFrom("meta")
      .selectAll()
      .where("plano_id", "=", plano_id)
      .execute();
    if (!meta) throw new NotFoundError("Metas não encontradas.");
    return meta;
  },
  async findById(id: string) {
    const meta = await trx
      .selectFrom("meta")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    if (!meta) throw new NotFoundError("Meta não encontrada.");
    return meta;
  },
  async create(data: NovoMeta) {
    return trx
      .insertInto("meta")
      .values(data)
      .returningAll()
      .executeTakeFirstOrThrow();
  },
  async update(id: string, data: AtualizaMeta) {
    const result = await trx
      .updateTable("meta")
      .set(data)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
    if (!result)
      throw new NotFoundError("Meta não encontrada para atualização.");

    return result;
  },
  async delete(id: string) {
    const res = await trx
      .deleteFrom("meta")
      .where("id", "=", id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);

    return count > 0;
  },
});
