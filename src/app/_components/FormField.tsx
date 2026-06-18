"use client";
import React from "react";
import Select from "react-select";
import Label from "./Label";
import Input from "./Input";
import Textarea from "./Textarea";
import {
  FieldValues,
  Path,
  UseFormRegister,
  Control,
  Controller,
} from "react-hook-form";
import { DatePicker } from "./DatePicker";
import { toYmdLocal } from "@/lib/date";
import { DateRangePicker } from "./DateRangePicker";

type Option = { value: string; label: string };

type FormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  title: string;
  type:
    | "text"
    | "textarea"
    | "select"
    | "date"
    | "dateRange"
    | "email"
    | "password"
    | "number";
  register: UseFormRegister<T>;
  control: Control<T>;
  error?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  options?: Option[];
};

const FormField = <T extends FieldValues>({
  name,
  title,
  type,
  register,
  control,
  error,
  inputProps,
  textareaProps,
  options,
}: FormFieldProps<T>) => {
  return (
    <div>
      <Label name={name} title={title} />
      {type === "textarea" ? (
        <Textarea id={name} {...register(name)} {...textareaProps} />
      ) : type === "select" ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={options}
              onChange={(val) => field.onChange(val?.value)}
              value={options?.find((opt) => opt.value === field.value)}
            />
          )}
        />
      ) : type === "date" ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value ? new Date(field.value) : null}
              onChange={(d) => field.onChange(d ? toYmdLocal(d) : "")}
            />
          )}
        />
      ) : type === "dateRange" ? (
        <div className="flex justify-center">
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <DateRangePicker
                value={field.value ?? { from: null, to: null }}
                onChange={(range) => field.onChange(range)}
              />
            )}
          />
        </div>
      ) : type === "number" ? (
        <Input
          id={name}
          type={type}
          {...register(
            name,
            type === "number" ? { valueAsNumber: true } : undefined,
          )}
          {...inputProps}
        />
      ) : (
        <Input id={name} type={type} {...register(name)} {...inputProps} />
      )}
      {error && <p className="text-secondery text-form-text">{error}</p>}
    </div>
  );
};

export default FormField;
