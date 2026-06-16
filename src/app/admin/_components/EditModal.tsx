"use client";
import Form from "@/app/_components/Form";
import { Modal } from "./Modal";
import { ButtonProps, FieldProps } from "@/app/_types/type";
import { FieldValues, DefaultValues } from "react-hook-form";
import type { ZodType, ZodTypeDef } from "zod";
import BlockTitle from "./BlockTitle";

interface Props<T extends FieldValues> {
  modalTitle: string;
  isOpen: boolean;
  onClose: () => void;
  fields: FieldProps[];
  buttons: ButtonProps[];
  schema: ZodType<T, ZodTypeDef, unknown>;
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
}

export const EditModal = <T extends FieldValues>({
  modalTitle,
  isOpen,
  onClose,
  fields,
  buttons,
  schema,
  onSubmit,
  defaultValues,
}: Props<T>) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-[520px] px-1 sm:px-2">
        <BlockTitle title={modalTitle} mode="modal" />
        <Form
          fields={fields}
          buttons={buttons}
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </div>
    </Modal>
  );
};
