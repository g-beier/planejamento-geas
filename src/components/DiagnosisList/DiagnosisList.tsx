"use client";

import { useEffect, useState } from "react";
import { Diagnosis } from "@/domain/types";
import { DiagnosisForm } from "@/components/DiagnosisForm";

type Props = {
  planId: string;
};

export function DiagnosisList({ planId }: Props) {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    if (!planId) return;

    fetch(`/api/plans/${planId}`)
      .then((res) => res.json())
      .then((data) => {
        setDiagnoses(data.indicators || []);
      });
  }, [planId]);

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      {diagnoses.map((diagnosis) => (
        <DiagnosisForm
          key={diagnosis.id}
          id={diagnosis.id}
          indicator={diagnosis.indicator}
          status={diagnosis.status}
          justification={diagnosis.justification}
        />
      ))}

      {diagnoses.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum indicador disponível para este plano.
        </p>
      )}
    </div>
  );
}
