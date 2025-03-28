import { CreatePlanForm } from "@/components/CreatePlanForm";

export default function NovoPlanoPage() {
  return (
    <div>
      <header className="w-full bg-white shadow px-6 py-4 mb-4">
        <h1 className="text-2xl font-bold">Criar novo plano</h1>
      </header>
      <main className="container mx-auto px-4 py-4">
        <CreatePlanForm />
      </main>
    </div>
  );
}
