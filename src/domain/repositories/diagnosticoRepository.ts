import { db } from "@/infra/db";
import { AtualizaDiagnostico, Diagnostico, NovoDiagnostico } from "@/types";

export const diagnosticoRepository = {
  async findByPlano(planoId: string): Promise<Diagnostico[]> {
    return db
      .selectFrom("diagnostico")
      .selectAll()
      .where("plano_id", "=", planoId)
      .orderBy("criado_em", "asc")
      .execute();
  },

  async findById(id: string): Promise<Diagnostico | undefined> {
    return db
      .selectFrom("diagnostico")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  },

  async create(data: NovoDiagnostico): Promise<Diagnostico> {
    const [novo] = await db
      .insertInto("diagnostico")
      .values(data)
      .returningAll()
      .execute();
    return novo;
  },

  async update(id: string, data: AtualizaDiagnostico): Promise<Diagnostico> {
    const [atualizado] = await db
      .updateTable("diagnostico")
      .set(data)
      .where("id", "=", id)
      .returningAll()
      .execute();
    return atualizado;
  },

  async delete(id: string): Promise<boolean> {
    const res = await db
      .deleteFrom("diagnostico")
      .where("id", "=", id)
      .executeTakeFirst();

    const count =
      typeof res.numDeletedRows === "bigint"
        ? Number(res.numDeletedRows)
        : Number(res.numDeletedRows ?? 0);

    return count > 0;
  },
};
