"use client";
import React, { useEffect } from "react";
import {
  FieldValues,
  useForm,
  DefaultValues,
  Path,
  Resolver,
} from "react-hook-form";
import { ButtonProps, FieldProps } from "../_types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "./Button";
import FormField from "./FormField";

type FormProps<T extends FieldValues> = {
  fields: FieldProps[];
  buttons: ButtonProps[];
  onSubmit: (data: T) => void;
  schema: Parameters<typeof zodResolver>[0];
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
    resolver: zodResolver(schema) as Resolver<T>,
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
          type={type}
          register={register}
          control={control}
          inputProps={inputProps}
          options={options}
          error={errors[name as Path<T>]?.message as string | undefined}
        />
      ))}

      <div className="flex size-full items-center justify-center gap-8">
        {buttons.map((btn, index) => (
          <Button
            key={index}
            {...btn}
            disabled={isSubmitting || btn.disabled}
          />
        ))}
      </div>
    </form>
  );
};

export default Form;
