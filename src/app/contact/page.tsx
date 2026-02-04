"use client";
import Form from "../_components/Form";
import { ButtonProps, FieldProps } from "../_types/type";
import { useRouter } from "next/navigation";
import SectionTitle from "../_components/SectionTitle";
import {
  ContactFormValue,
  contactFormValueSchema,
  ContactResponse,
  CreateContactRequest,
} from "@/schemas/contact";
import { apiReq } from "../_lib/api";

export default function ContactPage() {
  const router = useRouter();

  const fields: FieldProps[] = [
    {
      name: "name",
      title: "お名前 (ニックネーム)",
      type: "text",
      inputProps: { placeholder: "お名前 (ニックネーム)" },
    },
    {
      name: "email",
      title: "メールアドレス",
      type: "email",
      inputProps: { placeholder: "メールアドレス", autoComplete: "email" },
    },
    {
      name: "message",
      title: "お問い合わせ内容",
      type: "textarea",
      inputProps: { placeholder: "お問い合わせ内容" },
    },
  ];

  const buttons: ButtonProps[] = [
    { children: "お問い合わせ", className: "w-full", type: "submit" },
  ];

  // POST お問い合わせ送信処理
  const handleSubmit = async (data: ContactFormValue) => {
    const normalizedData: CreateContactRequest = {
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
    };

    try {
      const res = await apiReq<ContactResponse>(
        "/api/contact",
        "POST",
        normalizedData,
      );
      alert("お問い合わせを送信しました");
      router.replace("/signup");
    } catch (error) {
      console.error("お問い合わせの送信に失敗しました", error);
    }
  };

  return (
    <div className="m-auto my-[168px] w-[450px] p-1">
      <SectionTitle title="Contact us" isPublic />
      <Form
        fields={fields}
        buttons={buttons}
        schema={contactFormValueSchema}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
