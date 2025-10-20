import { NextRequest } from "next/server";
import { diagnosticoService } from "@/domain/services";
import { handleError } from "@/infra/errors";

/**
 * GET /api/diagnosticos
 * Retorna a lista de diagnosticos cadastrados em um plano.
 *
 */
export async function GET(req: NextRequest) {
  try {
    const planoId = req.nextUrl.searchParams.get("plano_id");
    if (!planoId) {
      return Response.json(
        { error: "Parâmetro plano_id é obrigatório" },
        { status: 400 }
      );
    }

    const diagnosticos = await diagnosticoService.listarPorPlano(planoId);
    return Response.json(diagnosticos);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/diagnosticos
 * Cria um novo diagnostico.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const novo = await diagnosticoService.criar(body);
    return Response.json(novo, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
