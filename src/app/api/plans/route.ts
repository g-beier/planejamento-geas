import { NextRequest, NextResponse } from "next/server";
import { db } from "@/infra/db";
import { z } from "zod";
import { parseErrorMessage } from "@/domain/helpers/parseErrorMessage";

const planSchema = z.object({
  title: z.string().min(3),
  year: z.number().int(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO date
  indicators: z.array(z.string().length(3)),
});

export async function GET() {
  try {
    const plans = await db
      .selectFrom("plan")
      .select(["id", "title", "year", "deadline", "created_at"])
      .orderBy("created_at", "desc")
      .execute();

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
    return new NextResponse("Erro ao buscar planos", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, year, deadline, indicators } = planSchema.parse(body);

    // 1. Inserir o plano
    const inserted = await db
      .insertInto("plan")
      .values({ title, year, deadline: new Date(deadline) })
      .returning(["id"])
      .executeTakeFirst();

    const planId = inserted?.id;

    if (!planId) {
      return new NextResponse("Erro ao criar plano", { status: 500 });
    }

    // 2. Inserir os indicadores relacionados
    const values = indicators.map((indicatorId) => ({
      plan_id: planId,
      indicator_id: indicatorId,
      status: null,
      justification: null,
    }));

    await db.insertInto("diagnosis").values(values).execute();

    return NextResponse.json({ id: planId }, { status: 201 });
  } catch (error: unknown) {
    console.error("Erro ao criar plano:", error);
    return new NextResponse(parseErrorMessage(error, "Erro ao criar o plano"), {
      status: 400,
    });
  }
}
