"use client";
import { supabase } from "@/utils/supabase";
import Form from "../_components/Form";
import { ButtonProps, FieldProps } from "../_types/type";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
  { label: "ログイン", className: "w-full", type: "submit" },
];

const loginSchema = z.object({
  email: z.string().email("メールアドレスを入力してください"),
  password: z.string().min(8, "８文字以上で入力してください"),
});

type LoginFormvalues = z.infer<typeof loginSchema>;

const defaultValues: LoginFormvalues = {
  email: "",
  password: "",
};

export default function Login() {
  const router = useRouter();

  const handleSubmit = async (values: LoginFormvalues) => {
    const { email, password } = values;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("ログインに失敗しました");
    } else {
      alert("ログインしました");
      router.replace("/test");
    }
  };

  return (
    <div className="m-auto w-[450px] p-1">
      <p className="text-center text-heading-1">Login</p>
      <Form
        fields={fields}
        buttons={buttons}
        onSubmit={handleSubmit}
        schema={loginSchema}
        defaultValues={defaultValues}
      />
      <Link
        href="/signup"
        className="mt-3 text-center text-form-text text-primary hover:underline"
      >
        アカウントをお持ちでない方はこちら
      </Link>
    </div>
  );
}
