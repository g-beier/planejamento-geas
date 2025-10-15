import { db } from "@/infra/db";
import { Indicador, AreaIndicador } from "@/types/indicador";

export const indicadorRepository = {
  async findAll(area?: string): Promise<Indicador[]> {
    let query = db.selectFrom("indicador").selectAll();

    if (area) {
      query = query.where("area", "=", area.toUpperCase() as AreaIndicador);
    }

    return query.execute();
  },

  async findById(id: string): Promise<Indicador | null> {
    const indicador = await db
      .selectFrom("indicador")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    return indicador ?? null;
  },
};
