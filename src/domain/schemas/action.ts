import { z } from "zod";

export const actionSchema = z.object({
  plan_id: z.string().uuid(),
  description: z.string().min(3),
  responsibles: z.string().min(1),
  frequency: z.string().min(1),
  fixed_date: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  type: z.enum(["DATA_FIXA", "PRAZO_FLEXIVEL"]),
});

export type ActionFormValues = z.infer<typeof actionSchema>;
