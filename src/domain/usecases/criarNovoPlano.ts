import z from "zod";
import { DBConnection } from "@/infra/db";
import {
  diagnosticoRepository,
  indicadorRepository,
  planoRepository,
} from "@repositories";
import { PlanoCreateSchema } from "../schemas";
import { NotFoundError, ValidationError } from "@/infra/errors";

export const criarNovoPlano = (conn: DBConnection) => {
  const indicadorRepo = indicadorRepository(conn);

  const InputSchema = z.object({
    plano: PlanoCreateSchema,
    indicadores: z
      .array(z.string().length(3))
      .nonempty("Deve haver ao menos um indicador"),
  });

  return {
    async executar(input: z.infer<typeof InputSchema>) {
      const parsed = InputSchema.safeParse(input);
      if (!parsed.success) {
        throw new ValidationError(
          parsed.error.issues.map((e) => e.message).join(", ")
        );
      }

      const { plano, indicadores } = parsed.data;

      const encontrados = await indicadorRepo.findByIds(indicadores);
      if (encontrados.length !== indicadores.length) {
        throw new NotFoundError(
          "Um ou mais indicadores não foram encontrados."
        );
      }

      const resultado = await conn.transaction().execute(async (trx) => {
        const planoTx = planoRepository(trx);
        const diagnosticoTx = diagnosticoRepository(trx);

        const novoPlano = planoTx.create(plano);

        for (const indicador of encontrados) {
          await diagnosticoTx.create({
            plano_id: (await novoPlano).id,
            indicador_id: indicador.id,
            resposta: null,
            justificativa: null,
          });
        }

        return novoPlano;
      });

      return resultado;
    },
  };
};
