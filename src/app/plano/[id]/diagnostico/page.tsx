// src/app/plano/[id]/diagnostico/page.tsx
"use client";

import { DiagnosisList } from "@/components/DiagnosisList";
import { usePlan } from "@/context/PlanContext";

export default function DiagnosticoPage() {
  const { plan } = usePlan();

  return (
    <div>
      <header className="w-full bg-white shadow px-6 py-4 mb-4">
        <h1 className="text-2xl font-bold">Responder Indicadores</h1>
      </header>

      <main className="container mx-auto px-4 py-4">
        {plan?.id ? (
          <DiagnosisList planId={plan.id} />
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum plano selecionado.
          </p>
        )}
      </main>
    </div>
  );
}
