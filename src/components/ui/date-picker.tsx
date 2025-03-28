"use client";

import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export interface DatePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange"
  > {
  /**
   * Valor da data no formato ISO (yyyy-MM-dd), como usado em bancos de dados.
   */
  value?: string;
  /**
   * Retorna a nova data selecionada, como string no formato yyyy-MM-dd.
   */
  onChangeValue?: (value: string | undefined) => void;
  /**
   * Placeholder a ser mostrado quando não há data selecionada.
   */
  placeholder?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      onChangeValue,
      placeholder = "Selecionar data",
      name,
      required,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const parsedDate = value ? parseISO(value) : undefined;
    const [open, setOpen] = React.useState(false);

    const handleSelect = (date: Date | undefined) => {
      if (date && isValid(date)) {
        onChangeValue?.(format(date, "yyyy-MM-dd"));
      } else {
        onChangeValue?.(undefined);
      }
      setOpen(false);
    };

    return (
      <div className="relative w-full">
        {/* Campo oculto que mantém compatibilidade com formulários HTML e react-hook-form */}
        <input
          ref={ref}
          type="hidden"
          name={name}
          value={value || ""}
          required={required}
          disabled={disabled}
          {...props}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              aria-label={name}
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground",
                className
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {parsedDate && isValid(parsedDate)
                ? format(parsedDate, "dd/MM/yyyy")
                : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={parsedDate}
              onSelect={handleSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
