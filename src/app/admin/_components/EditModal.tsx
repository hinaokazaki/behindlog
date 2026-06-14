"use client";
import Form from "@/app/_components/Form";
import { Modal } from "./Modal";
import { ButtonProps, FieldProps } from "@/app/_types/type";
import { ZodTypeAny } from "zod";
import BlockTitle from "./BlockTitle";

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
