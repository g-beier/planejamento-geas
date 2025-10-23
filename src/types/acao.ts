import { DB } from "@infra/db";
import { Insertable, Selectable, Updateable } from "kysely";

export type AcaoTable = DB["acao"];
export type Acao = Selectable<AcaoTable>;
export type NovoAcao = Insertable<AcaoTable>;
export type AtualizaAcao = Updateable<AcaoTable>;

export type MetaAcaoTable = DB["meta_acao"];
export type MetaAcao = Selectable<MetaAcaoTable>;
export type NovoMetaAcao = Insertable<MetaAcaoTable>;

export type AcaoResponsavelTable = DB["acao_responsavel"];
export type AcaoResponsavel = Selectable<AcaoResponsavelTable>;
export type NovoAcaoResponsavel = Insertable<AcaoResponsavelTable>;
