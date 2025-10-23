import { AreaIndicadorEnum } from "@schemas";
import { indicadorService } from "@/domain/services/indicadorService";
import { handleError } from "@/infra/errors";

/**
 * GET /api/indicadores
 * Lista todos os indicadores, opcionalmente filtrando por área.
 * Exemplo: /api/indicadores?area=VALORES
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const areaParam = searchParams.get("area");

    const area = (areaParam as AreaIndicadorEnum) ?? undefined;

    const indicadores = await indicadorService().listarTodos(area);
    return Response.json(indicadores, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
