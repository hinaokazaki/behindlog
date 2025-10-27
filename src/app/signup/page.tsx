"use client";
import Form from "../_components/Form";
import { supabase } from "@/utils/supabase";
import { ButtonProps, FieldProps } from "../_types/type";
import { z } from "zod";
import Link from "next/link";
import SectionTitle from "../_components/SectionTitle";
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken");

  const handleSubmit = async (values: SignupFormValues) => {
    const { email, password } = values;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: inviteToken
          ? `${process.env.NEXT_PUBLIC_REDIRECT_URL}?inviteToken=${inviteToken}`
          : process.env.NEXT_PUBLIC_REDIRECT_URL,
      },
    });

    if (error) {
      alert("登録に失敗しました");
    } else {
      alert("確認メールを送信しました。");
      router.replace("/auth/verify-request");
    }
  };

  return (
    <div className="m-auto my-[168px] w-[450px] p-1">
      <SectionTitle title="Signup" isPublic />
      <Form
        fields={fields}
        buttons={buttons}
        onSubmit={handleSubmit}
        schema={signupSchema}
        defaultValues={defaultValues}
      />
      <Link
        href="/login"
        className="mt-3 block text-center text-form-text text-primary hover:underline"
      >
        アカウントをお持ちの方はこちら
      </Link>
    </div>
  );
}
