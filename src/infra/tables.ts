import { Generated } from "kysely";

export type IndicadorArea =
  | "VALORES"
  | "PROGRAMA_EDUCATIVO"
  | "RECURSOS_HUMANOS"
  | "GESTAO"
  | "FINANCAS"
  | "CRESCIMENTO";

export interface IndicadorTable {
  id: string;
  pergunta: string;
  area: IndicadorArea;
  atualizado_em: Generated<string>;
}

export interface PlanoTable {
  id: Generated<string>;
  titulo: string;
  ano: number;
  criado_em: Generated<string>;
  arquivado: boolean;
}

export type DiagnosticoResposta = "SIM" | "EM_PARTE" | "NAO";

export interface DiagnosticoTable {
  plano_id: string;
  indicador_id: string;
  resposta: DiagnosticoResposta | null;
  justificativa: string | null;
  criado_em: Generated<string>;
  atualizado_em: Generated<string>;
}

export interface MetaTable {
  id: Generated<string>;
  plano_id: string;
  descricao: string;
}

export interface AcaoTable {
  id: Generated<string>;
  plano_id: string;
  descricao: string;
  frequencia: string;
  criado_em: Generated<string>;
  atualizado_em: Generated<string>;
}

export interface ResponsavelTable {
  id: Generated<string>;
  nome: string;
}

export interface OcorrenciaTable {
  id: Generated<string>;
  acao_id: string;
  descricao: string;
  ordem: number;
  realizado: boolean;
  data_realizacao: string | null;
}

export type SecaoRamo =
  | "FILHOTES"
  | "LOBINHO"
  | "ESCOTEIRO"
  | "SÊNIOR"
  | "PIONEIRO";
export interface SecaoTable {
  id: Generated<string>;
  nome: string;
  ramo: SecaoRamo;
}

export interface MetaIndicadorTable {
  meta_id: string;
  indicador_id: string;
}

export interface MetaAcaoTable {
  meta_id: string;
  acao_id: string;
}

export interface AcaoResponsavelTable {
  acao_id: string;
  responsavel_id: string;
}

export interface OcorrenciaSecaoTable {
  ocorrencia_id: string;
  secao_id: string;
  realizado: boolean;
  data_realizacao: string | null;
}
