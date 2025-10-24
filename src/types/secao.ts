import { DB } from "@/infra/db";
import { Insertable, Selectable, Updateable } from "kysely";

export type SecaoTable = DB["secao"];
export type Secao = Selectable<SecaoTable>;
export type NovoSecao = Insertable<SecaoTable>;
export type AtualizaSecao = Updateable<SecaoTable>;
