"use client";
import React, { useEffect } from "react";
import { FieldValues, useForm, DefaultValues, Path } from "react-hook-form";
import { ButtonProps } from "../_types/type";
import { FieldProps } from "../_types/type";
import { ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "./Button";
import FormField from "./FormField";

type FormProps<T> = {
  fields: FieldProps[];
  buttons: ButtonProps[];
  onSubmit: (data: T) => void;
  schema: ZodType<T, any, any>;
  defaultValues?: DefaultValues<T>;
};

const Form = <T extends FieldValues>({
  fields,
  buttons,
  onSubmit,
  schema,
  defaultValues,
}: FormProps<T>) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map(({ name, title, type, inputProps, options }) => (
        <FormField
          key={name}
          name={name as Path<T>}
          title={title}
          type={type as any}
          register={register}
          control={control}
          inputProps={inputProps}
          options={options}
          error={(errors[name as keyof T] as any)?.message}
        />
      ))}

      <div className="flex size-full items-center justify-center gap-8">
        {buttons.map((btn, index) => (
          <Button key={index} {...btn} />
        ))}
      </div>
    </form>
  );
};

export default Form;
