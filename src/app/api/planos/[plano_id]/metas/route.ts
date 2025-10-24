import { metaService } from "@/domain/services/metaService";
import { handleError } from "@/infra/errors";

/**
 * GET /api/metas
 * Retorna a lista de metas de um plano.
 */
export async function GET(
  _: Request,
  context: { params: Promise<{ plano_id: string }> }
) {
  try {
    const { plano_id } = await context.params;

    const metas = await metaService().listarTodos(plano_id);
  } catch (error) {
    handleError(error);
  }
}

/**
 * POST /api/metas
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ plano_id: string }> }
) {
  try {
    const { plano_id } = await context.params;
    const body = await request.json();

    const result = await metaService().criar({ ...body, plano_id });

    return Response.json(result);
  } catch (error) {
    handleError(error);
  }
}
