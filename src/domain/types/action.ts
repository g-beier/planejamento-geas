export type ActionType = "DATA_FIXA" | "PRAZO_FLEXIVEL";

export type Action = {
  id: string;
  plan_id: string;
  description: string;
  responsibles: string;
  frequency: string;
  fixed_date: string | null;
  type: ActionType;
};
