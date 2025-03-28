import { db } from "@/infra/db";
import { NextRequest, NextResponse } from "next/server";
import { parseErrorMessage } from "@/domain/helpers/parseErrorMessage";
import { PlanUpdateSchema } from "@/domain/schemas";
import { sql } from "kysely";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const plan = await db
      .selectFrom("plan")
      .select(["id", "title", "year", "deadline", "created_at"])
      .where("id", "=", id)
      .executeTakeFirst();

    if (!plan) {
      return new NextResponse("Plano não encontrado", { status: 404 });
    }

    const raw = await db
      .selectFrom("diagnosis")
      .innerJoin("indicator", "indicator.id", "diagnosis.indicator_id")
      .select([
        "diagnosis.id as id",
        "diagnosis.status",
        "diagnosis.justification",
        "indicator.id as indicator_id",
        "indicator.question",
        "indicator.area",
      ])
      .where("diagnosis.plan_id", "=", id)
      .orderBy(sql`CAST(indicator.id AS INTEGER)`) // 👈 ordenação numérica!
      .execute();

    const indicators = raw.map((row) => ({
      id: row.id,
      status: row.status,
      justification: row.justification,
      indicator: {
        id: row.indicator_id,
        question: row.question,
        area: row.area,
      },
    }));

    return NextResponse.json({ ...plan, indicators });
  } catch (error: unknown) {
    console.error("Erro ao buscar plano:", error);
    return new NextResponse(parseErrorMessage(error, "Erro ao buscar plano"), {
      status: 500,
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();
    const { title, year, deadline, diagnosis } = PlanUpdateSchema.parse(body);

    const parsedDeadline = deadline ? new Date(deadline) : undefined;

    // Atualiza o plano
    await db
      .updateTable("plan")
      .set({ title, year, deadline: parsedDeadline })
      .where("id", "=", id)
      .execute();

    // Busca os indicadores já existentes no diagnóstico
    const existing = await db
      .selectFrom("diagnosis")
      .select("indicator_id")
      .where("plan_id", "=", id)
      .execute();

    const existingIds = new Set(existing.map((row) => row.indicator_id));

    const newIndicators = diagnosis
      .map((d) => d.indicator_id)
      .filter((id) => !existingIds.has(id));

    if (newIndicators.length > 0) {
      await db
        .insertInto("diagnosis")
        .values(
          newIndicators.map((indicator_id) => ({
            plan_id: id,
            indicator_id,
            status: null,
            justification: null,
          }))
        )
        .execute();
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error("Erro ao atualizar plano:", error);
    return new NextResponse(
      parseErrorMessage(error, "Erro ao atualizar plano"),
      {
        status: 500,
      }
    );
  }
}
