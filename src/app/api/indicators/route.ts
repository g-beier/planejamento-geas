import { NextResponse } from "next/server";
import { db } from "@/infra/db";

export async function GET() {
  try {
    const indicators = await db
      .selectFrom("indicator")
      .select(["id", "question", "area"])
      .orderBy("id")
      .execute();

    return NextResponse.json(indicators);
  } catch (error) {
    console.error("Erro ao buscar indicadores:", error);
    return new NextResponse("Erro interno do servidor", { status: 500 });
  }
}
