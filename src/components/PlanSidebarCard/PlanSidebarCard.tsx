// src/components/PlanSidebarCard.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlanSelector } from "@/components/PlanSelector";
import { usePlan } from "@/context/PlanContext";
import { EditPlanDialog } from "../EditPlanDialog";

export function PlanSidebarCard() {
  const { plan } = usePlan();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Plano</CardTitle>
        <CardDescription>
          {plan ? `${plan.title} (${plan.year})` : "Nenhum plano selecionado"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {plan && (
          <Link href={`/plano/${plan.id}/diagnostico`} passHref>
            <Button variant={plan ? "default" : "secondary"} className="w-full">
              Responder Indicadores
            </Button>
          </Link>
        )}

        {plan && <EditPlanDialog />}

        <PlanSelector />

        <Link href="/plano/novo" passHref>
          <Button variant="secondary" className="w-full">
            Novo Plano
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
