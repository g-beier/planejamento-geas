"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plan } from "@/domain/types";
import { usePlan } from "@/context/PlanContext";
import { DialogTitle } from "@radix-ui/react-dialog";

export function PlanSelector() {
  const { plan, setPlan } = usePlan();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data));
  }, []);

  const handleSelect = async (p: Plan) => {
    const res = await fetch(`/api/plans/${p.id}`);
    const full = await res.json();
    setPlan(full); // agora sim é um PlanDetails
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={plan ? "secondary" : "default"} className="w-full">
          Selecionar Plano
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="font-semibold text-xl">
          Selecione um plano
        </DialogTitle>
        <ScrollArea className="max-h-64 ">
          <div className="flex flex-col gap-2">
            {plans.map((plan) => (
              <Button
                key={plan.id}
                variant="outline"
                className="w-full block"
                onClick={() => handleSelect(plan)}
              >
                {plan.title} ({plan.year})
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
