-- ENUMS
CREATE TYPE indicator_area AS ENUM (
  'VALORES',
  'PROGRAMA_EDUCATIVO',
  'RECURSOS_HUMANOS',
  'GESTAO',
  'FINANCAS',
  'CRESCIMENTO'
);

CREATE TYPE status_enum AS ENUM (
  'SIM',
  'EM_PARTE',
  'NAO'
);

CREATE TYPE action_type AS ENUM (
  'DATA_FIXA',
  'PRAZO_FLEXIVEL'
);

-- PLANOS
CREATE TABLE plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year INT NOT NULL,
  deadline DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDICADORES (biblioteca)
CREATE TABLE indicator (
  id char(3) PRIMARY KEY,
  question TEXT NOT NULL,
  area indicator_area NOT NULL
);

-- RELAÇÃO plano <-> indicador (com status e parecer)
CREATE TABLE diagnosis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
  indicator_id char(3) NOT NULL REFERENCES indicator(id) ON DELETE CASCADE,
  status status_enum,
  justification TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- METAS
CREATE TABLE goal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnosis_id UUID NOT NULL REFERENCES diagnosis(id) ON DELETE CASCADE,
  description TEXT NOT NULL
);

-- AÇÕES (pertencem ao plano)
CREATE TABLE action (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  responsibles TEXT NOT NULL,
  frequency TEXT NOT NULL,
  fixed_date DATE,
  type action_type NOT NULL
);

-- RELAÇÃO N:N entre ações e indicadores
CREATE TABLE action_indicator (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES action(id) ON DELETE CASCADE,
  diagnosis_id UUID NOT NULL REFERENCES diagnosis(id) ON DELETE CASCADE,
  UNIQUE (action_id, diagnosis_id)
);

-- LOG DE AÇÕES REALIZADAS
CREATE TABLE action_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id UUID NOT NULL REFERENCES action(id) ON DELETE CASCADE,
  done_at TIMESTAMP,
  notes TEXT,
  done BOOLEAN DEFAULT FALSE
);
