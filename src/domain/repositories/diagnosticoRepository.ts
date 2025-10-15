import { DB, db } from "@/infra/db";
import { Insertable, Selectable, Updateable } from "kysely";

export type DiagnosticoTable = DB["diagnostico"];
export type Diagnostico = Selectable<DiagnosticoTable>;
export type NovoDiagnostico = Insertable<DiagnosticoTable>;
export type AtualizaDiagnostico = Updateable<DiagnosticoTable>;

export const diagnosticoRepository = {
  async listarPorPlano(planoId: string): Promise<Diagnostico[]> {
    return db
      .selectFrom("diagnostico")
      .selectAll()
      .where("plano_id", "=", planoId)
      .orderBy("criado_em", "asc")
      .execute();
  },

  async buscarPorId(id: string): Promise<Diagnostico | undefined> {
    return db
      .selectFrom("diagnostico")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  },

  async criar(data: NovoDiagnostico): Promise<Diagnostico> {
    const [novo] = await db
      .insertInto("diagnostico")
      .values(data)
      .returningAll()
      .execute();
    return novo;
  },

  async atualizar(id: string, data: AtualizaDiagnostico): Promise<Diagnostico> {
    const [atualizado] = await db
      .updateTable("diagnostico")
      .set(data)
      .where("id", "=", id)
      .returningAll()
      .execute();
    return atualizado;
  },

  async excluir(id: string): Promise<void> {
    await db.deleteFrom("diagnostico").where("id", "=", id).execute();
  },
};
