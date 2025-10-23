import { DB } from "@/infra/db";
import { Insertable, Updateable } from "kysely";

export type SecaoTable = DB["secao"];
export type NovoSecao = Insertable<SecaoTable>;
export type AtualizaSecao = Updateable<SecaoTable>;
