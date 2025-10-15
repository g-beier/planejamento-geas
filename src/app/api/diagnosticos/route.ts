import { NextRequest } from "next/server";
import { diagnosticoService } from "@/domain/services";
import { handleError } from "@/infra/errors";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const novo = await diagnosticoService.criar(body);
    return Response.json(novo, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  req: NextRequest,
  context: Promise<{ params: { id?: string } }>
) {
  try {
    const { params } = await context;
    const id = params?.id ?? req.nextUrl.searchParams.get("id");
    if (!id) {
      return Response.json({ error: "id é obrigatório" }, { status: 400 });
    }

    const body = await req.json();
    const atualizado = await diagnosticoService.atualizar(id, body);
    return Response.json(atualizado);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  context: Promise<{ params: { id?: string } }>
) {
  try {
    const { params } = await context;
    const id = params?.id ?? req.nextUrl.searchParams.get("id");
    if (!id) {
      return Response.json({ error: "id é obrigatório" }, { status: 400 });
    }

    await diagnosticoService.excluir(id);
    return Response.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
