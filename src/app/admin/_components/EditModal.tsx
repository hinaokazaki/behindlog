"use client";
import Form from "@/app/_components/Form";
import { Modal } from "./Modal";
import { ButtonProps, FieldProps } from "@/app/_types/type";
import { ZodTypeAny } from "zod";

interface Props<TFormValues> {
  modalTitle: string;
  isOpen: boolean;
  onClose: () => void;
  fields: FieldProps[];
  buttons: ButtonProps[];
  schema: ZodTypeAny;
  onSubmit: (data: TFormValues) => void;
  defaultValues?: TFormValues;
}

export const EditModal = <TFormValues,>({
  modalTitle,
  isOpen,
  onClose,
  fields,
  buttons,
  schema,
  onSubmit,
  defaultValues,
}: Props<TFormValues>) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h1 className="mb-6 text-base text-subtitle-top font-bold">
          {modalTitle}
        </h1>
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
