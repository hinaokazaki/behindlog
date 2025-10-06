"use client";
import Form from "@/app/_components/Form";
import { ButtonProps, FieldProps } from "@/app/_types/type";
import SectionTitle from "@/app/_components/SectionTitle";
import { themeOptions } from "@/constants/themeOptions";
import moment from "moment-timezone";
import { Profile, ProfileResponse } from "@/schemas/me";
import useFetch from "../_hooks/useFetch";
import Loading from "@/app/_components/Loading";
import { profileFormSchema, ProfileFormValues } from "@/schemas/profileForm";
import { useApi } from "@/app/_hooks/useApi";

export default function ProfilePage() {
  const { callApi } = useApi();

  const timezoneOptions = moment.tz
    .names()
    .map((tz) => ({ value: tz, label: tz }));

  const fields: FieldProps[] = [
    {
      name: "name",
      title: "お名前 (ニックネーム)",
      type: "text",
      inputProps: { placeholder: "お名前 (ニックネーム)" },
    },
    {
      name: "colorTheme",
      title: "カラーテーマ",
      type: "select",
      options: themeOptions,
      inputProps: { placeholder: "カラーテーマを選択してください" },
    },
    {
      name: "timezone",
      title: "タイムゾーン",
      type: "select",
      options: timezoneOptions,
      inputProps: { placeholder: "カラーテーマを選択してください" },
    },
  ];

  const buttons: ButtonProps[] = [
    { label: "変更を保存", className: "w-full", type: "submit" },
  ];

  // GET: api/me profile情報取得
  const { data, error, isLoading } = useFetch<{ profile: Profile }>("/api/me");
  if (!data) return <Loading />;
  const profile = data.profile;

  const defaultValues: ProfileFormValues = {
    name: profile.name ?? "",
    colorTheme: profile.colorTheme ?? "ORIGINAL",
    timezone: profile.timezone ?? "Asia/Tokyo",
  };

  // PATCH 更新処理
  const handleUpdate = async (data: ProfileFormValues) => {
    // API用にnullを許容する形に変換（バックエンド用スキーマと整合）
    const normalizedData = {
      name: data.name.trim() ? data.name : null,
      colorTheme: data.colorTheme ? data.colorTheme : null,
      timezone: data.timezone,
    };

    try {
      const res = await callApi<ProfileResponse>(
        "/api/me",
        "PATCH",
        normalizedData,
      );
      alert("プロフィールを更新しました");
      console.log(res.profile);
    } catch (error) {
      console.error("プロフィールの更新に失敗しました", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="m-auto my-[84px] w-[450px] p-1">
      <SectionTitle title="Profile" />
      <Form
        fields={fields}
        buttons={buttons}
        schema={profileFormSchema}
        defaultValues={defaultValues}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
