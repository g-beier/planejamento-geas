import { diagnosticoService } from "@/domain/services";
import { handleError } from "@/infra/errors";

/**
 * GET /api/planos/:plano_id/diagnosticos/:indicador_id
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ plano_id: string; indicador_id: string }> }
) {
  try {
    const { plano_id, indicador_id } = await context.params;

    const result = await diagnosticoService().buscarPorId(
      plano_id,
      indicador_id
    );

    return Response.json(result);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/planos/:plano_id/diagnosticos/:indicador_id
 */
export async function PUT(
  request: Request,
  context: { params: Promise<{ plano_id: string; indicador_id: string }> }
) {
  try {
    const { plano_id, indicador_id } = await context.params;
    const body = await request.json();

    const result = await diagnosticoService().atualizar(
      plano_id,
      indicador_id,
      body
    );

    return Response.json(result);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/planos/:plano_id/diagnosticos/:indicador_id
 */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ plano_id: string; indicador_id: string }> }
) {
  try {
    const { plano_id, indicador_id } = await context.params;

    const result = await diagnosticoService().excluir(plano_id, indicador_id);

    return Response.json(result);
  } catch (error) {
    return handleError(error);
  }
}
