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
import { DateRangePicker } from "./DaterangePicker";

type Option = { value: string; label: string };

type FormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  title: string;
  type: "text" | "textarea" | "select" | "dateRange" | "email" | "password";
  register: UseFormRegister<T>;
  control: Control<T>;
  error?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
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
  options,
}: FormFieldProps<T>) => {
  return (
    <div>
      <Label name={name} title={title} />
      {type === "textarea" ? (
        <Textarea id={name} {...register(name)} {...(inputProps as any)} />
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
      ) : type === "dateRange" ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DateRangePicker
              value={field.value ?? { from: null, to: null }}
              onChange={field.onChange}
            />
          )}
        />
      ) : (
        <Input id={name} type={type} {...register(name)} {...inputProps} />
      )}
      {error && <p className="text-secondery text-form-text">{error}</p>}
    </div>
  );
};

export default FormField;
