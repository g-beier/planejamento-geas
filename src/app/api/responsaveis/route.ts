import { responsavelService } from "@/domain/services/responsavelService";
import { handleError } from "@/infra/errors/handleError";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const responsaveis = await responsavelService().listarTodos();
    return Response.json(responsaveis, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const novo = await responsavelService().criar(body);
    return Response.json(novo, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
