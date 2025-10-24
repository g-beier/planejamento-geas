import { diagnosticoService } from "@/domain/services";
import { handleError } from "@/infra/errors";

/**
 * GET /api/planos/:plano_id/diagnosticos
 * Retorna a lista de diagnósticos de um plano.
 */
export async function GET(
  _: Request,
  context: { params: Promise<{ plano_id: string }> }
) {
  try {
    const { plano_id } = await context.params;
    const diagnosticos = await diagnosticoService().listarPorPlano(plano_id);
    return Response.json(diagnosticos, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/planos/:plano_id/diagnosticos
 * Cria um novo diagnóstico para o plano.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ plano_id: string }> }
) {
  try {
    const body = await request.json();
    const { plano_id } = await context.params;
    const result = await diagnosticoService().criar({
      ...body,
      plano_id,
    });

    return Response.json(result, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
