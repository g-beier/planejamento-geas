import { DB } from "@infra/db";
import { Insertable, Selectable, Updateable } from "kysely";

export type OcorrenciaTable = DB["ocorrencia"];
export type Ocorrencia = Selectable<OcorrenciaTable>;
export type NovoOcorencia = Insertable<OcorrenciaTable>;
export type AtualizaOcorrencia = Updateable<OcorrenciaTable>;

export type OcorrenciaSecaoTable = DB["ocorrencia_secao"];
export type OcorrenciaSecao = Selectable<OcorrenciaSecaoTable>;
export type NovoOcorrenciaSecao = Insertable<OcorrenciaSecaoTable>;
export type AtualizaOcorrenciaSecao = Updateable<OcorrenciaSecaoTable>;
