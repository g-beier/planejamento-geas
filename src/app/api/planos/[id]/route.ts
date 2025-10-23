import { planoService } from "@/domain/services/planoService";
import { handleError } from "@/infra/errors";

/**
 * GET /api/planos/:id
 * Retorna um plano específico pelo ID.
 */
export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const plano = await planoService().buscarPorId(id);
    return Response.json(plano, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/planos/:id
 * Atualiza um plano existente.
 */
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const planoAtualizado = await planoService().atualizar(id, body);
    return Response.json(planoAtualizado, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/planos/:id
 * Remove um plano pelo ID.
 */
export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await planoService().remover(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
