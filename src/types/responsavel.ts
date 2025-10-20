import { DB } from "@infra/db";
import { Insertable, Selectable, Updateable } from "kysely";

export type ResponsavelTable = DB["responsavel"];
export type Responsavel = Selectable<ResponsavelTable>;
export type NovoResponsavel = Insertable<ResponsavelTable>;
export type AtualizaResponsavel = Updateable<ResponsavelTable>;
