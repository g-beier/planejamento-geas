"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  diagnosisUpdateSchema,
  DiagnosisUpdateInput,
} from "@/domain/schemas/diagnosis";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Indicator } from "@/domain/types";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader } from "../ui/card";
import { formatAreaLabel } from "@/domain/helpers/formatAreaLabel";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormSaveStatus } from "@/hooks/useFormSaveStatus";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { usePlan } from "@/context/PlanContext";

type Props = {
  id: string;
  indicator: Indicator;
  status?: DiagnosisUpdateInput["status"] | null;
  justification?: string | null;
  onSave?: () => void;
};

export function DiagnosisForm({
  id,
  indicator,
  status = "NAO",
  justification = "",
  onSave,
}: Props) {
  const form = useForm<DiagnosisUpdateInput>({
    resolver: zodResolver(diagnosisUpdateSchema),
    defaultValues: {
      status: typeof status === "string" ? status : undefined,
      justification: justification ?? "",
    },
  });
  const { refreshPlan } = usePlan();

  const timeout = useRef<NodeJS.Timeout | null>(null);
  const [saved, setSaved] = useState(true);
  useFormSaveStatus(`diagnosis-${id}`, saved);

  const save = useCallback(
    async (data: DiagnosisUpdateInput) => {
      try {
        await fetch(`/api/diagnosis/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        setSaved(true);
        onSave?.();
        refreshPlan();

        if (timeout.current) clearTimeout(timeout.current);
      } catch (err) {
        console.error("Erro ao salvar diagnóstico", err);
      }
    },
    [id, onSave, refreshPlan]
  );

  const debouncedSave = useDebouncedCallback(save, 750);

  useEffect(() => {
    const sub = form.watch((values) => {
      setSaved(false);
      debouncedSave(values);
    });
    return () => sub.unsubscribe();
  }, [form, debouncedSave]);

  return (
    <Form {...form}>
      <form>
        <Card>
          <CardHeader>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium uppercase">
                {indicator.id} — {formatAreaLabel(indicator.area)}
              </p>
              <p className="font-semibold">{indicator.question}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <Label>
                        <RadioGroupItem value="SIM" />
                        Sim
                      </Label>
                      <Label>
                        <RadioGroupItem value="EM_PARTE" />
                        Em parte
                      </Label>
                      <Label>
                        <RadioGroupItem value="NAO" />
                        Não
                      </Label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parecer coletivo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explique a decisão do grupo..."
                      {...field}
                      value={field.value ?? ""}
                      className="resize-none h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
