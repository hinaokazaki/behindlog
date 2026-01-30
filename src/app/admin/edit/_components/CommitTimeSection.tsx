"use client";
import Form from "@/app/_components/Form";
import BlockTitle from "../../_components/BlockTitle";
import { ButtonProps, FieldProps } from "@/app/_types/type";
import { useCommittimeQuery } from "../../_hooks/useCommittimeQuery";
import Loading from "@/app/_components/Loading";
import { commitTimeFormSchema } from "@/schemas/committimeFormSchema";
import { useApi } from "@/app/_hooks/useApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CommittimeResponse } from "@/schemas/committime";

type CommitTimeForm = {
  targetTime: number;
  deadline: { from: Date | null; to: Date | null };
};

const CommitTimeSection = () => {
  const committimeQuery = useCommittimeQuery();
  const { callApi } = useApi();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields: FieldProps[] = [
    {
      name: "targetTime",
      title: "目標の合計時間",
      type: "number",
      inputProps: { placeholder: "目標の合計時間を決めよう" },
    },
    {
      name: "deadline",
      title: "期限",
      type: "dateRange",
    },
  ];

  const Buttons: ButtonProps[] = [
    {
      children: "キャンセル",
      className: "",
      type: "button",
      disabled: isSubmitting,
      // onClick: ,
      color: "red",
      variant: "outlined",
    },
    {
      children: "作成",
      className: "",
      type: "submit",
      disabled: isSubmitting,
      color: "red",
      variant: "filled",
    },
  ];

  if (committimeQuery.isLoading) return <Loading />;
  if (committimeQuery.error)
    return (
      <p>
        目標時間の取得でエラーが発生しました: {committimeQuery.error.message}
      </p>
    );

  // deafultValues
  const emptyDefaultValues: CommitTimeForm = {
    targetTime: 0,
    deadline: { from: null, to: null },
  };

  const committime = committimeQuery.data?.committime;

  const defaultValues: CommitTimeForm = committime
    ? {
        targetTime: committime.targetTime,
        deadline: {
          from: new Date(committime.startDate),
          to: new Date(committime.endDate),
        },
      }
    : emptyDefaultValues;

  const onSubmit = async (data: CommitTimeForm) => {
    if (!data.deadline.from || !data.deadline.to) return;

    const payload = {
      targetTime: data.targetTime,
      startDate: data.deadline.from,
      endDate: data.deadline.to,
    };

    // api call
    try {
      setIsSubmitting(true);
      await callApi<CommittimeResponse>("/api/committime", "PATCH", payload);
      router.refresh();
      await committimeQuery.mutate();
    } catch (error) {
      console.error("Update committime failed", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
      <BlockTitle title="Commit Time" />
      <Form
        fields={fields}
        buttons={Buttons}
        onSubmit={onSubmit}
        schema={commitTimeFormSchema}
        defaultValues={defaultValues}
      />
    </section>
  );
};

export default CommitTimeSection;
