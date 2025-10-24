import { secaoService } from "@services";
import { handleError } from "@/infra/errors/handleError";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const responsavel = await secaoService().buscarPorId(id);

    return Response.json(responsavel, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const atualizado = await secaoService().atualizar(id, body);

    return Response.json(atualizado, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await secaoService().remover(id);

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
