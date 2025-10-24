import { NextResponse } from "next/server";
import { acaoService } from "@/domain/services/acaoService";
import { handleError } from "@/infra/errors";

/**
 * GET /api/acoes/:id
 * Retorna uma ação específica pelo ID.
 */
export async function GET(
  _: Request,
  context: { params: Promise<{ acao_id: string }> }
) {
  try {
    const { acao_id } = await context.params;

    const acao = await acaoService().buscarPorId(acao_id);

    return NextResponse.json(acao, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/acoes/:acao_id
 * Atualiza os dados de uma ação.
 */
export async function PUT(
  request: Request,
  context: { params: Promise<{ acao_id: string }> }
) {
  try {
    const { acao_id } = await context.params;
    const data = await request.json();

    const acao = await acaoService().atualizar(acao_id, data);

    return NextResponse.json(acao, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/acoes/:acao_id
 * Remove permanentemente uma ação.
 */
export async function DELETE(
  _: Request,
  context: { params: Promise<{ acao_id: string }> }
) {
  try {
    const { acao_id } = await context.params;

    const acao = await acaoService().remover(acao_id);

    return NextResponse.json(acao, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
