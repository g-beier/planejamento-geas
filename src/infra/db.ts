import { Generated, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});

// Definição do schema
export interface Database {
  plan: {
    id: Generated<string>;
    title: string;
    year: number;
    deadline: Date;
    created_at: Generated<Date>;
  };
  indicator: {
    id: string;
    question: string;
    area: string;
  };
  diagnosis: {
    id: Generated<string>;
    plan_id: string;
    indicator_id: string;
    status: "SIM" | "EM_PARTE" | "NAO" | null;
    justification: string | null;
    created_at: Generated<Date>;
  };
  goal: {
    id: Generated<string>;
    plan_indicator_id: string;
    description: string;
  };
  action: {
    id: Generated<string>;
    plan_id: string;
    description: string;
    responsibles: string;
    frequency: string;
    fixed_date: Date | null;
    type: "DATA_FIXA" | "PRAZO_FLEXIVEL";
  };
  action_indicator: {
    id: Generated<string>;
    action_id: string;
    plan_indicator_id: string;
  };
  action_log: {
    id: Generated<string>;
    action_id: string;
    done_at: Generated<Date> | null;
    notes: string | null;
    done: boolean;
  };
}
