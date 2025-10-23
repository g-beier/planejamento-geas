import { planoService } from "@/domain/services/planoService";
import { handleError } from "@/infra/errors";

/**
 * GET /api/planos
 * Retorna a lista de planos cadastrados.
 */
export async function GET() {
  try {
    const planos = await planoService().listarTodos();
    return Response.json(planos, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/planos
 * Cria um novo plano de grupo.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plano = await planoService().criar(body);
    return Response.json(plano, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
