import { NextResponse } from "next/server";
import { acaoService } from "@/domain/services/acaoService";
import { handleError } from "@/infra/errors";

/**
 * GET /api/acoes/:id
 * Retorna uma ação específica pelo ID.
 */
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const acao = await acaoService.buscarPorId(params.id);
    return NextResponse.json(acao, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/acoes/:id
 * Atualiza os dados de uma ação.
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const acao = await acaoService.atualizar(params.id, data);
    return NextResponse.json(acao, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/acoes/:id
 * Remove permanentemente uma ação.
 */
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const acao = await acaoService.remover(params.id);
    return NextResponse.json(acao, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
