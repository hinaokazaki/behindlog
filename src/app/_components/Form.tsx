"use client";
import React from "react";
import { FieldValues, useForm, DefaultValues, Path } from "react-hook-form";
import { ButtonProps } from "../_types/type";
import { FieldProps } from "../_types/type";
import { ZodType, ZodTypeAny, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Label from "./Label";
import Textarea from "./Textarea";
import Input from "./Input";
import Button from "./Button";

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
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map(({ name, title, type, inputProps }) => (
        <div key={name}>
          <Label name={name} title={title} />
          {type === "textarea" ? (
            <Textarea id={name} {...inputProps} />
          ) : (
            <Input
              id={name}
              type={type}
              {...inputProps}
              {...register(name as Path<T>)}
            />
          )}
          {errors[name as keyof T] && (
            <p className="text-secondery text-form-text text-secondary">
              {(errors[name as keyof T] as any)?.message}
            </p>
          )}
        </div>
      ))}

      <div className="flex gap-4">
        {buttons.map((btn, index) => (
          <Button key={index} {...btn} />
        ))}
      </div>
    </form>
  );
};

export default Form;
