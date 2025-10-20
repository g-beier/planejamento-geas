import { DB } from "@infra/db";
import { Insertable, Selectable, Updateable } from "kysely";

export type DiagnosticoTable = DB["diagnostico"];
export type Diagnostico = Selectable<DiagnosticoTable>;
export type NovoDiagnostico = Insertable<DiagnosticoTable>;
export type AtualizaDiagnostico = Updateable<DiagnosticoTable>;
