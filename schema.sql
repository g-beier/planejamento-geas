-- ENUMS

CREATE TYPE area_indicador AS ENUM (
  'VALORES',
  'PROGRAMA_EDUCATIVO',
  'RECURSOS_HUMANOS',
  'GESTAO',
  'FINANCAS',
  'CRESCIMENTO'
);

CREATE TYPE status_avaliacao AS ENUM (
  'SIM',
  'EM_PARTE',
  'NAO'
);

-- TABELAS

CREATE TABLE plano (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  ano INTEGER NOT NULL,
  prazo_final DATE NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE indicador (
  id CHAR(3) PRIMARY KEY,
  pergunta TEXT NOT NULL,
  area area_indicador NOT NULL
);

CREATE TABLE diagnostico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_id UUID NOT NULL REFERENCES plano(id) ON DELETE CASCADE,
  indicador_id CHAR(3) NOT NULL REFERENCES indicador(id) ON DELETE CASCADE,
  status status_avaliacao,
  justificativa TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostico_id UUID NOT NULL REFERENCES diagnostico(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor_alvo TEXT,
  unidade TEXT,
  prazo DATE
);

CREATE TABLE responsavel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registro TEXT NOT NULL UNIQUE,
  nome_exibicao TEXT NOT NULL
);

CREATE TABLE acao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_id UUID NOT NULL REFERENCES plano(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  frequencia TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ocorrencia_acao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  acao_id UUID NOT NULL REFERENCES acao(id) ON DELETE CASCADE,
  referencia TEXT NOT NULL,
  realizado BOOLEAN DEFAULT FALSE,
  data_realizacao TIMESTAMP,
  observacoes TEXT,
  atualizado_por UUID REFERENCES responsavel(id),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE acao_diagnostico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  acao_id UUID NOT NULL REFERENCES acao(id) ON DELETE CASCADE,
  diagnostico_id UUID NOT NULL REFERENCES diagnostico(id) ON DELETE CASCADE,
  UNIQUE (acao_id, diagnostico_id)
);

CREATE TABLE acao_responsavel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  acao_id UUID NOT NULL REFERENCES acao(id) ON DELETE CASCADE,
  responsavel_id UUID NOT NULL REFERENCES responsavel(id) ON DELETE CASCADE,
  UNIQUE (acao_id, responsavel_id)
);

CREATE TABLE ciclo_programa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_id UUID NOT NULL REFERENCES plano(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL
);
