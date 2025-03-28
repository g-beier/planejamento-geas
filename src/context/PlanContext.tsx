"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { PlanDetails } from "@/domain/types";

interface PlanContextValue {
  plan: PlanDetails | null;
  setPlan: (plan: PlanDetails | null) => void;
  updatePlan: (changes: Partial<PlanDetails>) => void;
  refreshPlan: () => Promise<void>;
}

const PlanContext = createContext<PlanContextValue | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<PlanDetails | null>(null);

  const refreshPlan = useCallback(async () => {
    const storedId = localStorage.getItem("selectedPlanId");
    if (storedId) {
      const res = await fetch(`/api/plans/${storedId}`);
      const data: PlanDetails = await res.json();
      setPlan(data);
    }
  }, []);

  useEffect(() => {
    if (!plan) {
      refreshPlan();
    }
  }, [plan, refreshPlan]);

  const setPlan = (plan: PlanDetails | null) => {
    setPlanState(plan);
    if (plan) {
      localStorage.setItem("selectedPlanId", plan.id);
    } else {
      localStorage.removeItem("selectedPlanId");
    }
  };

  const updatePlan = (changes: Partial<PlanDetails>) => {
    setPlanState((prev) => (prev ? { ...prev, ...changes } : prev));
  };

  return (
    <PlanContext.Provider value={{ plan, setPlan, updatePlan, refreshPlan }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
