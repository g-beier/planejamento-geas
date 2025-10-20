import { NextRequest } from "next/server";
import { diagnosticoService } from "@/domain/services";
import { handleError } from "@/infra/errors";

/**
 * GET /api/diagnosticos/:id
 * Retorna um diagnóstico específico pelo ID.
 */
export async function GET(
  _req: NextRequest,
  context: Promise<{ params: { id: string } }>
) {
  try {
    const { params } = await context;
    const { id } = params;

    const diagnostico = await diagnosticoService.buscarPorId(id);
    if (!diagnostico) {
      return Response.json(
        { error: "Diagnóstico não encontrado" },
        { status: 404 }
      );
    }

    return Response.json(diagnostico, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/diagnosticos/:id
 * Atualiza o status e a justificativa de um diagnóstico.
 */
export async function PUT(
  req: NextRequest,
  context: Promise<{ params: { id: string } }>
) {
  try {
    const { params } = await context;
    const { id } = params;

    const body = await req.json();
    const atualizado = await diagnosticoService.atualizar(id, body);

    return Response.json(atualizado, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/diagnosticos/:id
 * Remove permanentemente um diagnóstico.
 */
export async function DELETE(
  _req: NextRequest,
  context: Promise<{ params: { id: string } }>
) {
  try {
    const { params } = await context;
    const { id } = params;

    await diagnosticoService.excluir(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
