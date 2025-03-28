export type Plan = {
  id: string;
  title: string;
  year: number;
  deadline: string; // ISO
  created_at: string;
};

import type { Diagnosis } from "./diagnosis";

export type PlanDetails = Plan & {
  indicators: Diagnosis[];
};
