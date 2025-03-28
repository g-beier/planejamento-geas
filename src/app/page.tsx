"use client";

import { PlanActions } from "@/components/PlanActions";
import { PlanSidebarCard } from "@/components/PlanSidebarCard";

export default function Home() {
  return (
    <div>
      <header className="w-full bg-white shadow px-6 py-4 mb-4">
        <h1 className="text-2xl font-bold">Plano de Grupo</h1>
      </header>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        <aside className="lg:col-span-1 space-y-4">
          <PlanSidebarCard />
        </aside>

        <main className="lg:col-span-3 space-y-4">
          <PlanActions />
        </main>
      </div>
    </div>
  );
}
