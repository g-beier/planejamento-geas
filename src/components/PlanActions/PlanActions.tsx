import { usePlan } from "@/context/PlanContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDiagnosisStatus } from "@/domain/helpers/formatDiagnosisStatus";

export function PlanActions() {
  const { plan } = usePlan();

  if (!plan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ações do Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhum plano selecionado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações do Plano</CardTitle>
      </CardHeader>
      <CardContent>
        {(plan.indicators ?? []).map((action) => (
          <div key={action.id} className="mb-2">
            <p className="font-medium">
              {action.indicator.id} - {action.indicator.question}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="uppercase font-semibold inline-block mr-4">
                {formatDiagnosisStatus(action.status ?? "")}
              </span>
              {action.justification}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
