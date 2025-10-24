import z from "zod";

export enum SecaoRamoEnum {
  FILHOTES = "FILHOTES",
  LOBINHO = "LOBINHO",
  ESCOTEIRO = "ESCOTEIRO",
  SENIOR = "SÊNIOR",
  PIONEIRO = "PIONEIRO",
}
export const SecaoRamoSchema = z.enum(SecaoRamoEnum);

export const SecaoSchema = z.object({
  id: z.uuid(),
  nome: z.string(),
  ramo: SecaoRamoSchema,
});

export const SecaoCreateSchema = SecaoSchema.pick({ nome: true, ramo: true });
export const SecaoUpdateSchema = SecaoCreateSchema.partial();
