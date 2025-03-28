import { db } from "@/infra/db";
import { NextRequest, NextResponse } from "next/server";
import { parseErrorMessage } from "@/domain/helpers/parseErrorMessage";
import { diagnosisUpdateSchema } from "@/domain/schemas";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = diagnosisUpdateSchema.parse(body);

    await db
      .updateTable("diagnosis")
      .set({
        ...(parsed.status && { status: parsed.status }),
        ...(parsed.justification !== undefined && {
          justification: parsed.justification,
        }),
      })
      .where("id", "=", id)
      .execute();

    return new NextResponse("Diagnóstico atualizado com sucesso", {
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Erro ao atualizar diagnóstico:", error);
    return new NextResponse(
      parseErrorMessage(error, "Erro ao atualizar diagnóstico"),
      {
        status: 400,
      }
    );
  }
}
