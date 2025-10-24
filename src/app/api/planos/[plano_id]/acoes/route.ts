import { NextResponse } from "next/server";
import { acaoService } from "@/domain/services/acaoService";
import { handleError } from "@/infra/errors";

/**
 * GET /api/acoes
 * Retorna a lista de ações filtradas por plano.
 * Exemplo? /api/planos/:plano_id/acoes
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ plano_id: string }> }
) {
  try {
    const { plano_id } = await context.params;

    const acoes = await acaoService().listarPorPlano(plano_id);

    return NextResponse.json(acoes, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ plano_id: string }> }
) {
  try {
    const { plano_id } = await context.params;
    const body = await request.json();

    const acao = await acaoService().criar({ ...body, plano_id });

    return NextResponse.json(acao, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
