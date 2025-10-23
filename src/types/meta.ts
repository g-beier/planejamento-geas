import { DB } from "@/infra/db";
import { Insertable, Updateable, Selectable } from "kysely";

export type MetaTable = DB["meta"];
export type Meta = Selectable<MetaTable>;
export type NovoMeta = Insertable<MetaTable>;
export type AtualizaMeta = Updateable<MetaTable>;

export type MetaIndicadorTable = DB["meta_indicador"];
export type MetaIndicador = Selectable<MetaIndicadorTable>;
export type NovoMetaIndicador = Insertable<MetaIndicadorTable>;
