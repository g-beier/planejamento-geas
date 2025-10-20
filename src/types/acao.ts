import { DB } from "@infra/db";
import { Insertable, Selectable, Updateable } from "kysely";

export type AcaoTable = DB["acao"];
export type Acao = Selectable<AcaoTable>;
export type NovoAcao = Insertable<AcaoTable>;
export type AtualizaAcao = Updateable<AcaoTable>;
