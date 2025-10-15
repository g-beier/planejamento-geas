import { Kysely, PostgresDialect, Generated } from "kysely";
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

export type TipoAcao = "DATA_FIXA" | "PRAZO_FLEXIVEL";

export interface AcaoTable {
  id: Generated<string>;
  plano_id: string;
  descricao: string;
  tipo: TipoAcao;
}

export type TipoAgendamento = "UNICO" | "RECORRENTE" | "CICLO";

export interface AgendamentoAcaoTable {
  id: Generated<string>;
  acao_id: string;
  tipo: TipoAgendamento;
  descricao: string | null;
  data_fixa: string | null;
  ciclo: number | null;
  intervalo: string | null;
}

export interface OcorrenciaAcaoTable {
  id: Generated<string>;
  agendamento_id: string;
  data_planejada: string;
  realizado: boolean;
  data_realizacao: string | null;
  observacoes: string | null;
  atualizado_por: string | null;
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

export interface CicloProgramaTable {
  id: Generated<string>;
  plano_id: string;
  nome: string;
  data_inicio: string;
  data_fim: string;
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
  agendamento_acao: AgendamentoAcaoTable;
  ocorrencia_acao: OcorrenciaAcaoTable;
  acao_diagnostico: AcaoDiagnosticoTable;
  acao_responsavel: AcaoResponsavelTable;
  ciclo_programa: CicloProgramaTable;
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
