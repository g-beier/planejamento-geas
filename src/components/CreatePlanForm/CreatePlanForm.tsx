"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { planFormSchema, PlanFormValues } from "@/domain/schemas/plan";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatAreaLabel } from "@/domain/helpers/formatAreaLabel";
import { DatePicker } from "../ui/date-picker";
import { useFormSaveStatus } from "@/hooks/useFormSaveStatus";

type Indicator = {
  id: string;
  question: string;
  area: string;
};

export function CreatePlanForm() {
  const router = useRouter();
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
  useFormSaveStatus("create-plan", !isDirty);

  useEffect(() => {
    fetch("/api/indicators")
      .then((res) => res.json())
      .then((data) => setIndicators(data));
  }, []);

  const onSubmit = async (data: PlanFormValues) => {
    const res = await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const created = await res.json();
      localStorage.setItem("selectedPlanId", created.id);
      router.push("/");
    } else {
      alert("Erro ao criar plano");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Criar Plano</CardTitle>
            <CardDescription>
              Preencha as informações principais e selecione os indicadores.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
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
                    <FormLabel>Deadline</FormLabel>
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
                      return (
                        <FormItem
                          key={ind.id}
                          className="flex items-start space-x-2 border-t pt-2 first:pt-0 first:border-none"
                        >
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
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
          </CardContent>

          <CardFooter>
            <Button type="submit">Criar Plano</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
