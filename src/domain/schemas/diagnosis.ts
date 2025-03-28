import { z } from "zod";

export const diagnosisSchema = z.object({
  diagnoses: z.array(
    z.object({
      id: z.string().uuid(),
      status: z.enum(["SIM", "EM_PARTE", "NAO"]),
      justification: z.string().min(5),
    })
  ),
});

export type DiagnosisInput = z.infer<typeof diagnosisSchema>;

export const diagnosisUpdateSchema = z.object({
  status: z.enum(["SIM", "EM_PARTE", "NAO"]).optional(),
  justification: z.string().nullable().optional(),
});

export type DiagnosisUpdateInput = z.infer<typeof diagnosisUpdateSchema>;
