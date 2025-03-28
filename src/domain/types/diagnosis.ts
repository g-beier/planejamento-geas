import type { Indicator } from "./indicator";

export type Status = "SIM" | "EM_PARTE" | "NAO";

export type Diagnosis = {
  id: string;
  plan_id: string;
  indicator_id: string;
  status: Status | null;
  justification: string | null;
  created_at: string;
  indicator: Indicator;
};
