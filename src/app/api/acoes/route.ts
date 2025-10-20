import { NextResponse } from "next/server";
import { acaoService } from "@/domain/services/acaoService";
import { handleError } from "@/infra/errors";

/**
 * GET /api/acoes
 * Retorna a lista de ações filtradas por plano.
 * Exemplo? /api/acoes?plano_id=XXXXXX-XXXX-XXXX-XXXXXX
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const planoId = searchParams.get("plano_id");

    if (!planoId) {
      return NextResponse.json(
        { error: "plano_id é obrigatório" },
        { status: 400 }
      );
    }

    const acoes = await acaoService.listarPorPlano(planoId);
    return NextResponse.json(acoes, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const acao = await acaoService.criar(body);
    return NextResponse.json(acao, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
