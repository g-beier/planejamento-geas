"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "../ui/date-picker";
import { useEffect, useState } from "react";
import { usePlan } from "@/context/PlanContext";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { planFormSchema, PlanFormValues } from "@/domain/schemas/plan";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatAreaLabel } from "@/domain/helpers/formatAreaLabel";
import { useFormSaveStatus } from "@/hooks/useFormSaveStatus";

type Indicator = {
  id: string;
  question: string;
  area: string;
};

export function EditPlanDialog() {
  const { plan, updatePlan } = usePlan();
  const [open, setOpen] = useState(false);
  const [indicators, setIndicators] = useState<Indicator[]>([]);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
      deadline: "",
      indicators: [],
    },
  });

  const isDirty = form.formState.isDirty;
  useFormSaveStatus("edit-plan", !isDirty);

  useEffect(() => {
    if (plan) {
      form.reset({
        title: plan.title,
        year: plan.year,
        deadline: plan.deadline.split("T")[0],
        indicators: (plan.indicators ?? []).map((d) => d.indicator.id),
      });
    }
  }, [plan, form]);

  useEffect(() => {
    fetch("/api/indicators")
      .then((res) => res.json())
      .then((data) => setIndicators(data));
  }, []);

  const onSubmit = async (values: PlanFormValues) => {
    if (!plan) return;

    const updated = {
      title: values.title,
      year: values.year,
      deadline: values.deadline,
      diagnosis: values.indicators.map((id) => ({ indicator_id: id })),
    };

    await fetch(`/api/plans/${plan.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    const refreshed = await fetch(`/api/plans/${plan.id}`).then((r) =>
      r.json()
    );
    updatePlan(refreshed);

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Editar Plano
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Plano</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Selecione novos indicadores, ajuste o título, ano de referência ou o
            prazo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChangeValue={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="block mb-2">Indicadores</FormLabel>
              <div className="max-h-96 overflow-y-auto bg-background rounded-md p-4 space-y-4 border">
                {indicators.map((ind) => (
                  <FormField
                    key={ind.id}
                    control={form.control}
                    name="indicators"
                    render={({ field }) => {
                      const isChecked = field.value?.includes(ind.id);
                      const isAlreadyInPlan = plan?.indicators.some(
                        (d) => d.indicator.id === ind.id
                      );

                      return (
                        <FormItem
                          key={ind.id}
                          className="flex items-start space-x-2 border-t pt-2 first:pt-0 first:border-none"
                        >
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
                              disabled={isAlreadyInPlan}
                              onCheckedChange={(checked) => {
                                const newVal = checked
                                  ? [...(field.value || []), ind.id]
                                  : (field.value || []).filter(
                                      (v) => v !== ind.id
                                    );
                                field.onChange(newVal);
                              }}
                            />
                          </FormControl>
                          <p className="text-sm leading-tight">
                            <strong className="inline-block mr-4">
                              {ind.id} - {formatAreaLabel(ind.area)}
                            </strong>
                            <span className="text-muted-foreground">
                              {ind.question}
                            </span>
                          </p>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
