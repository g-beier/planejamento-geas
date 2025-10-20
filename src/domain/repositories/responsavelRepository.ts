import { db } from "@/infra/db";
import { Responsavel, NovoResponsavel, AtualizaResponsavel } from "@types";

export const responsavelRepository = {
  async findAll(): Promise<Responsavel[]> {
    return db.selectFrom("responsavel").selectAll().execute();
  },
  async findById(id: string): Promise<Responsavel | null> {
    const row = await db
      .selectFrom("responsavel")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
    return row ?? null;
  },
  async create(data: NovoResponsavel): Promise<Responsavel> {
    const row = await db
      .insertInto("responsavel")
      .values({
        nome_exibicao: data.nome_exibicao,
        registro: data.registro,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return row;
  },
  async update(
    id: string,
    data: AtualizaResponsavel
  ): Promise<Responsavel | null> {
    const row = await db
      .updateTable("responsavel")
      .set({
        nome_exibicao: data.nome_exibicao,
        registro: data.registro,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return row;
  },
  async delete(id: string): Promise<boolean> {
    const res = await db
      .deleteFrom("responsavel")
      .where("id", "=", id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);
    return count > 0;
  },
};
