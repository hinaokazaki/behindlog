"use client";
import Form from "@/app/_components/Form";
import BlockTitle from "../../_components/BlockTitle";
import { ButtonProps, FieldProps } from "@/app/_types/type";
import { useCommitTimeActions } from "../../_hooks/useCommitTimeActions";
import { useCommittimeQuery } from "../../_hooks/useCommittimeQuery";
import Loading from "@/app/_components/Loading";
import { Committime } from "@/schemas/committime";
import { commitTimeFormSchema } from "@/schemas/committimeFormSchema";

type CommitTimeForm = {
  targetTime: number;
  deadline: { from: Date | null; to: Date | null };
};

const CommitTimeSection = () => {
  const committimeQuery = useCommittimeQuery();
  const actions = useCommitTimeActions();

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
      disabled: actions.isSubmitting,
      onClick: ,
      color: "red",
      variant: "outlined",
    },
    {
      children: "作成",
      className: "",
      type: "submit",
      disabled: actions.isSubmitting,
      color: "red",
      variant: "filled",
    },
  ];

  if (committimeQuery.isLoading) return <Loading />;
  if (committimeQuery.error)
    return <p>目標の取得でエラーが発生しました: {committimeQuery.error.message}</p>;
  if (!committimeQuery.data) return;
  const commitimeData: Committime = committimeQuery.data?.committime;

  const onSubmit = (data: CommitTimeForm) => {
    if(!DataTransfer.deadline.from || !DataTransfer.deadline.to) return;

    const payload = {
      targetTime: data.targetTime,
      startDate: data.deadline.from,
      endDate: date.deadline.to,
    }

    // api call 
  }

  return (
    <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
      <BlockTitle title="Commit Time" />
      <Form
        fields={fields}
        buttons={Buttons}
        onSubmit={onSubmit}
        schema={commitTimeFormSchema}
        defaultValues={
          targetTime: 0,
          period: { from: null, to: null },
        }
      />
    </section>
  );
};

export default CommitTimeSection;
