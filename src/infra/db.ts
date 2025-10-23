import { Kysely, PostgresDialect, Transaction } from "kysely";
import { Pool } from "pg";
import {
  AcaoResponsavelTable,
  AcaoTable,
  DiagnosticoTable,
  IndicadorTable,
  MetaAcaoTable,
  MetaIndicadorTable,
  MetaTable,
  OcorrenciaSecaoTable,
  OcorrenciaTable,
  PlanoTable,
  ResponsavelTable,
  SecaoTable,
} from "./tables";

// INTERFACE DB
export interface DB {
  plano: PlanoTable;
  indicador: IndicadorTable;
  diagnostico: DiagnosticoTable;
  meta: MetaTable;
  responsavel: ResponsavelTable;
  acao: AcaoTable;
  ocorrencia: OcorrenciaTable;
  meta_indicador: MetaIndicadorTable;
  meta_acao: MetaAcaoTable;
  acao_responsavel: AcaoResponsavelTable;
  secao: SecaoTable;
  ocorrencia_secao: OcorrenciaSecaoTable;
}

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    }),
  }),
});

export type DBConnection = Kysely<DB> | Transaction<DB>;
