import { z } from "zod";

export const goalSchema = z.object({
  plan_indicator_id: z.string().uuid(),
  description: z.string().min(3),
});

export type GoalFormValues = z.infer<typeof goalSchema>;
