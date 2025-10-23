import { AcaoResponsavel } from "@/types";
import z from "zod";

export const AcaoResponsavelSchema = z.object({
  acao_id: z.uuid(),
  responsavel_id: z.uuid(),
}) satisfies z.ZodType<AcaoResponsavel>;
