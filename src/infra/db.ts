import { Kysely, PostgresDialect, Generated, Transaction } from "kysely";
import { Pool } from "pg";

/**
 * Definições de tipos das tabelas do banco
 */

export interface PlanoTable {
  id: Generated<string>;
  titulo: string;
  ano: number;
  prazo_final: string; // DATE ISO
  criado_em: string | null;
}

export type AreaIndicador =
  | "VALORES"
  | "PROGRAMA_EDUCATIVO"
  | "RECURSOS_HUMANOS"
  | "GESTAO"
  | "FINANCAS"
  | "CRESCIMENTO";

export interface IndicadorTable {
  id: string;
  pergunta: string;
  area: AreaIndicador;
}

export type StatusAvaliacao = "SIM" | "EM_PARTE" | "NAO";

export interface DiagnosticoTable {
  id: Generated<string>;
  plano_id: string;
  indicador_id: string;
  status: StatusAvaliacao | null;
  justificativa: string | null;
  criado_em: string | null;
}

export interface MetaTable {
  id: Generated<string>;
  diagnostico_id: string;
  descricao: string;
  valor_alvo: string | null;
  unidade: string | null;
  prazo: string | null;
}

export interface ResponsavelTable {
  id: Generated<string>;
  registro: string;
  nome_exibicao: string;
}

export interface AcaoTable {
  id: Generated<string>;
  plano_id: string;
  descricao: string;
  frequencia: string;
  criado_em: string | null;
}

export interface OcorrenciaAcaoTable {
  id: Generated<string>;
  acao_id: string;
  referencia: string;
  realizado: boolean;
  data_realizacao: string | null;
  observacoes: string | null;
  atualizado_por: string | null;
  criado_em: string | null;
}

export interface AcaoDiagnosticoTable {
  id: Generated<string>;
  acao_id: string;
  diagnostico_id: string;
}

export interface AcaoResponsavelTable {
  id: Generated<string>;
  acao_id: string;
  responsavel_id: string;
}

/**
 * Interface DB agregando todas as tabelas
 */
export interface DB {
  plano: PlanoTable;
  indicador: IndicadorTable;
  diagnostico: DiagnosticoTable;
  meta: MetaTable;
  responsavel: ResponsavelTable;
  acao: AcaoTable;
  ocorrencia_acao: OcorrenciaAcaoTable;
  acao_diagnostico: AcaoDiagnosticoTable;
  acao_responsavel: AcaoResponsavelTable;
}

/**
 * Instância do Kysely com PostgreSQL
 */
export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    }),
  }),
});

export type DBConnection = Kysely<DB> | Transaction<DB>;
