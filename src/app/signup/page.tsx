"use client";
import Form from "../_components/Form";
import { supabase } from "@/utils/supabase";
import { ButtonProps, FieldProps } from "../_types/type";
import { z } from "zod";
import Link from "next/link";

const fields: FieldProps[] = [
  {
    name: "email",
    title: "メールアドレス",
    type: "email",
    inputProps: { placeholder: "メールアドレス", autoComplete: "email" },
  },
  {
    name: "password",
    title: "パスワード",
    type: "password",
    inputProps: { placeholder: "パスワード", autoComplete: "password" },
  },
];

const buttons: ButtonProps[] = [
  { label: "新規登録", className: "w-full", type: "submit" },
];

const signupSchema = z.object({
  email: z.string().email("メールアドレスを入力してください"),
  password: z.string().min(8, "８文字以上で入力してください"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const defaultValues: SignupFormValues = {
  email: "",
  password: "",
};

export default function Signup() {
  const handleSubmit = async (values: SignupFormValues) => {
    const { email, password } = values;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/test`,
      },
    });
    if (error) {
      alert("登録に失敗しました");
    } else {
      alert("確認メールを送信しました。");
    }
  };

  return (
    <div className="m-auto w-[450px] p-1">
      <p className="text-center text-heading-1">Signup</p>
      <Form
        fields={fields}
        buttons={buttons}
        onSubmit={handleSubmit}
        schema={signupSchema}
        defaultValues={defaultValues}
      />
      <Link
        href="/login"
        className="mt-3 text-center text-form-text text-primary hover:underline"
      >
        アカウントをお持ちの方はこちら
      </Link>
    </div>
  );
}
