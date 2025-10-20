import { Plano, NovoPlano, AtualizaPlano } from "@/types";
import { db } from "@infra/db";

export const planoRepository = {
  async findAll(): Promise<Plano[]> {
    return db.selectFrom("plano").selectAll().execute();
  },

  async findById(id: string): Promise<Plano | null> {
    const row = await db
      .selectFrom("plano")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    return row ?? null;
  },

  async create(data: NovoPlano): Promise<Plano> {
    const row = await db
      .insertInto("plano")
      .values({
        titulo: data.titulo,
        ano: data.ano,
        prazo_final: data.prazo_final,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return row;
  },

  async update(id: string, data: AtualizaPlano): Promise<Plano | null> {
    const row = await db
      .updateTable("plano")
      .set({
        titulo: data.titulo ?? undefined,
        ano: data.ano ?? undefined,
        prazo_final: data.prazo_final ?? undefined,
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
    return row ?? null;
  },

  async remove(id: string): Promise<boolean> {
    const res = await db
      .deleteFrom("plano")
      .where("id", "=", id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);
    return count > 0;
  },
};
