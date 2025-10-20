import { DB } from "@infra/db";
import { Insertable, Selectable, Updateable } from "kysely";

export type PlanoTable = DB["plano"];
export type Plano = Selectable<PlanoTable>;
export type NovoPlano = Insertable<PlanoTable>;
export type AtualizaPlano = Updateable<PlanoTable>;
