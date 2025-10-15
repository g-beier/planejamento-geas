// src/domain/repositories/planoRepository.ts
import { db } from "@/infra/db";
import { Plano, PlanoCreateInput, PlanoUpdateInput } from "@/types/plano";

export const planoRepository = {
  // nunca null: pode retornar [] vazia
  async findAll(): Promise<Plano[]> {
    return db.selectFrom("plano").selectAll().execute();
  },

  // pode não existir
  async findById(id: string): Promise<Plano | null> {
    const row = await db
      .selectFrom("plano")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    return row ?? null;
  },

  // garante retorno (se o banco não inserir algo, lança)
  async create(data: PlanoCreateInput): Promise<Plano> {
    const row = await db
      .insertInto("plano")
      .values({
        titulo: data.titulo,
        ano: data.ano,
        prazo_final: data.prazo_final,
      })
      .returningAll()
      .executeTakeFirstOrThrow(); // <- garante não-nulo
    return row;
  },

  // pode não existir
  async update(id: string, data: PlanoUpdateInput): Promise<Plano | null> {
    const row = await db
      .updateTable("plano")
      .set({
        titulo: data.titulo ?? undefined,
        ano: data.ano ?? undefined,
        prazo_final: data.prazo_final ?? undefined,
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst(); // <- pode ser undefined
    return row ?? null;
  },

  // retorna boolean com base no número de linhas deletadas (BigInt)
  async remove(id: string): Promise<boolean> {
    const res = await db
      .deleteFrom("plano")
      .where("id", "=", id)
      .executeTakeFirst();
    // Kysely retorna { numDeletedRows: bigint | string }, dependendo do driver
    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);
    return count > 0;
  },
};
