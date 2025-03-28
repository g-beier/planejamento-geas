import { z } from "zod";

export const planFormSchema = z.object({
  title: z.string().min(3),
  year: z.coerce.number().int(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  indicators: z.array(z.string().length(3)).min(1),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;

export const PlanUpdateSchema = z.object({
  title: z.string().min(1),
  year: z.number(),
  deadline: z.string().optional(),
  diagnosis: z.array(z.object({ indicator_id: z.string() })),
});
