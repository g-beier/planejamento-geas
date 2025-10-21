import { DB } from "@infra/db";
import { Insertable, Selectable, Updateable } from "kysely";

export type OcorrenciaAcaoTable = DB["ocorrencia_acao"];
export type OcorrenciaAcao = Selectable<OcorrenciaAcaoTable>;
export type NovoOcorrenciaAcao = Insertable<OcorrenciaAcaoTable>;
export type AtualizaOcorrenciaAcao = Updateable<OcorrenciaAcaoTable>;
