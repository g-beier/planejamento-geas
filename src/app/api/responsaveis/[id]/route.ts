import { responsavelService } from "@/domain/services/responsavelService";
import { handleError } from "@/infra/errors/handleError";
import { NextRequest } from "next/server";

type Params = {
  params: { id: string };
};

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const responsavel = await responsavelService.buscarPorId(params.id);
    return Response.json(responsavel, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();
    const atualizado = await responsavelService.atualizar(params.id, body);
    return Response.json(atualizado, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await responsavelService.remover(params.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
