"use client";
import Form from "@/app/_components/Form";
import { Modal } from "./Modal";
import { ButtonProps, FieldProps } from "@/app/_types/type";
import { modalItemForm, modalItemSchema } from "@/schemas/modalItemSchema";

interface Props {
  modalTitle: string;
  isOpen: boolean;
  onClose: () => void;
  fields: FieldProps[];
  buttons: ButtonProps[];
  onSubmit: () => void;
  defaultValues?: modalItemForm;
}

export const EditModal: React.FC<Props> = ({
  modalTitle,
  isOpen,
  onClose,
  fields,
  buttons,
  onSubmit,
  defaultValues,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h1 className="mb-6 text-base text-subtitle-top font-bold">
          {modalTitle}
        </h1>
        <Form
          fields={fields}
          buttons={buttons}
          schema={modalItemSchema}
          onSubmit={onSubmit}
          defaultValues={
            defaultValues ?? { title: "", dataRange: { from: null, to: null } }
          }
        />
      </div>
    </Modal>
  );
};
