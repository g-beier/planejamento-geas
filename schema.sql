-- ENUMS --
CREATE TYPE indicador_area AS ENUM (
  'VALORES',
  'PROGRAMA_EDUCATIVO',
  'RECURSOS_HUMANOS',
  'GESTAO',
  'FINANCAS',
  'CRESCIMENTO'
);

CREATE TYPE diagnostico_resposta AS ENUM (
  'SIM',
  'EM_PARTE',
  'NAO'
);

CREATE TYPE secao_ramo AS ENUM (
  'FILHOTES', 
  'LOBINHO', 
  'ESCOTEIRO', 
  'SENIOR', 
  'PIONEIRO'
);

-- INDICADORES --
CREATE TABLE indicador (
  id CHAR(3) PRIMARY KEY,
  pergunta TEXT NOT NULL,
  area indicador_area NOT NULL,
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABELAS --
CREATE TABLE plano (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  ano INTEGER NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  arquivado BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE diagnostico (
  indicador_id CHAR(3) NOT NULL REFERENCES indicador(id) ON DELETE CASCADE,
  plano_id UUID NOT NULL REFERENCES plano(id) ON DELETE CASCADE,
  resposta diagnostico_resposta,
  justificativa TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(plano_id, indicador_id)
);

CREATE TABLE meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_id UUID NOT NULL REFERENCES plano(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL
);

CREATE TABLE acao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plano_id UUID NOT NULL REFERENCES plano(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  frequencia TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE responsavel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL
);

CREATE TABLE ocorrencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  acao_id UUID NOT NULL REFERENCES acao(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  ordem INTEGER NOT NULL,
  realizado BOOLEAN DEFAULT FALSE,
  data_realizacao DATE,
  UNIQUE (acao_id, ordem)
);

CREATE TABLE secao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  ramo secao_ramo NOT NULL
);


-- RELACIONAMENTOS
CREATE TABLE meta_indicador (
  indicador_id CHAR(3) NOT NULL REFERENCES indicador(id) ON DELETE CASCADE,
  meta_id UUID NOT NULL REFERENCES meta(id) ON DELETE CASCADE,
  PRIMARY KEY (indicador_id, meta_id)
);

CREATE TABLE meta_acao (
  acao_id UUID NOT NULL REFERENCES acao(id) ON DELETE CASCADE,
  meta_id UUID NOT NULL REFERENCES meta(id) ON DELETE CASCADE,
  PRIMARY KEY (acao_id, meta_id)
);

CREATE TABLE acao_responsavel (
  acao_id UUID NOT NULL REFERENCES acao(id) ON DELETE CASCADE,
  responsavel_id UUID NOT NULL REFERENCES responsavel(id) ON DELETE CASCADE,
  PRIMARY KEY (acao_id, responsavel_id)
);

CREATE TABLE ocorrencia_secao (
  ocorrencia_id UUID NOT NULL REFERENCES ocorrencia(id) ON DELETE CASCADE,
  secao_id UUID NOT NULL REFERENCES secao(id) ON DELETE CASCADE,
  realizado BOOLEAN NOT NULL DEFAULT FALSE,
  data_realizacao DATE,
  PRIMARY KEY(ocorrencia_id, secao_id)
);

-- CONSTRAINTs --
ALTER TABLE plano
  ADD CONSTRAINT chk_plano_ano_valido CHECK (ano >= 2000);

ALTER TABLE ocorrencia
  ADD CONSTRAINT chk_ocorrencia_ordem CHECK (ordem > 0);

ALTER TABLE ocorrencia
  ADD CONSTRAINT chk_ocorrencia_realizacao CHECK (
    (realizado = FALSE AND data_realizacao IS NULL)
    OR (realizado = TRUE)
  );

ALTER TABLE ocorrencia_secao
  ADD CONSTRAINT chk_ocorrencia_secao_realizacao CHECK (
    (realizado = FALSE AND data_realizacao IS NULL)
    OR (realizado = TRUE)
  );

ALTER TABLE responsavel
  ADD CONSTRAINT chk_responsavel_nome_not_blank CHECK (btrim(nome) <> '');

ALTER TABLE secao
  ADD CONSTRAINT chk_secao_nome_not_blank CHECK (btrim(nome) <> '');

ALTER TABLE acao
  ADD CONSTRAINT chk_acao_descricao_not_blank CHECK (btrim(descricao) <> '');

ALTER TABLE meta
  ADD CONSTRAINT chk_meta_descricao_not_blank CHECK (btrim(descricao) <> '');

ALTER TABLE ocorrencia
  ADD CONSTRAINT chk_ocorrencia_descricao_not_blank CHECK (btrim(descricao) <> '');

-- TRIGGERs --
-- METAS e AÇÕES devem pertencer ao MESMO PLANO
CREATE OR REPLACE FUNCTION fn_chk_meta_acao_mesmo_plano()
RETURNS trigger AS $$
DECLARE
  plano_meta UUID;
  plano_acao UUID;
BEGIN
  SELECT plano_id INTO plano_meta FROM meta WHERE id = NEW.meta_id;
  SELECT plano_id INTO plano_acao FROM acao WHERE id = NEW.acao_id;

  IF plano_meta IS DISTINCT FROM plano_acao THEN
    RAISE EXCEPTION 'Meta e Ação devem pertencer ao mesmo plano.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_chk_meta_acao_mesmo_plano
BEFORE INSERT OR UPDATE ON meta_acao
FOR EACH ROW
EXECUTE FUNCTION fn_chk_meta_acao_mesmo_plano();

-- METAS devem se relacionar com INDICADORES que foram avaliados no PLANO
CREATE OR REPLACE FUNCTION fn_chk_meta_indicador_mesmo_plano()
RETURNS trigger AS $$
DECLARE
  plano_meta UUID;
BEGIN
  SELECT plano_id INTO plano_meta FROM meta WHERE id = NEW.meta_id;

  PERFORM 1
  FROM diagnostico d
  WHERE d.indicador_id = NEW.indicador_id
    AND d.plano_id = plano_meta
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Indicador não pertence ao mesmo plano da meta.'
      USING HINT = 'Verifique se existe diagnóstico desse indicador no mesmo plano da meta.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_chk_meta_indicador_mesmo_plano
BEFORE INSERT OR UPDATE ON meta_indicador
FOR EACH ROW
EXECUTE FUNCTION fn_chk_meta_indicador_mesmo_plano();

-- OCORRENCIAS que são por seção NÃO DEVEM SER AVALIADAS
CREATE OR REPLACE FUNCTION fn_chk_ocorrencia_sem_secao_realizado()
RETURNS trigger AS $$
BEGIN
  IF (NEW.realizado IS TRUE OR NEW.data_realizacao IS NOT NULL)
     AND EXISTS (SELECT 1 FROM ocorrencia_secao WHERE ocorrencia_id = NEW.id) THEN
    RAISE EXCEPTION 'Ocorrência não pode ter "realizado" ou "data_realizacao" se há seções vinculadas.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_chk_ocorrencia_sem_secao_realizado
BEFORE INSERT OR UPDATE ON ocorrencia
FOR EACH ROW
EXECUTE FUNCTION fn_chk_ocorrencia_sem_secao_realizado();
