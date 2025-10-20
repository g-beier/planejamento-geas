import { indicadorService } from "@/domain/services/indicadorService";
import { handleError } from "@/infra/errors";

/**
 * GET /api/indicadores/:id
 * Retorna os dados de um indicador específico.
 */
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const indicador = await indicadorService.buscarPorId(id);
    return Response.json(indicador, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
