"use client";
import Form from "@/app/_components/Form";
import { ButtonProps, FieldProps } from "@/app/_types/type";
import { commitTimeFormSchema } from "@/schemas/committimeFormSchema";
import {
  CommittimeResponse,
  UpdateCommittimeRequest,
} from "@/schemas/committime";
import { fromYmdLocal, toYmdLocal } from "@/lib/date";
import { useApi } from "@/app/_hooks/useApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BlockTitle from "@/app/admin/_components/BlockTitle";
import { useCommittimeSummaryQuery } from "@/app/admin/_hooks/useCommittimeSummaryQuery";
import { useCommittimeQuery } from "@/app/admin/_hooks/useCommittimeQuery";
import useFetch from "@/app/admin/_hooks/useFetch";
import { DailyRecord } from "@prisma/client";

type CommitTimeForm = {
  targetTime: number;
  deadline: { from: Date | null; to: Date | null };
};

type UpdateCommittimeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  committime?: {
    targetTime: number | null;
    startDate: string | null;
    endDate: string | null;
  };
  date: string;
};

const UpdateCommittimeModal = ({
  isOpen,
  onClose,
  committime,
  date,
}: UpdateCommittimeModalProps) => {
  const { callApi } = useApi();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const committimeSummaryQuery = useCommittimeSummaryQuery();
  const committimeQuery = useCommittimeQuery();
  const recordQuery = useFetch<{ dailyRecord: DailyRecord }>(
    `/api/records/${date}`,
  );

  if (!isOpen) return null;

  const fields: FieldProps[] = [
    {
      name: "targetTime",
      title: "目標の合計時間 [単位：時間]",
      type: "number",
      inputProps: { placeholder: "目標の合計時間を決めよう" },
    },
    {
      name: "deadline",
      title: "期限",
      type: "dateRange",
    },
  ];

  const buttons: ButtonProps[] = [
    {
      children: "新しい目標時間設定を保存",
      type: "submit",
      disabled: isSubmitting,
      color: "red",
      variant: "filled",
      className: "mt-4 px-8",
    },
  ];

  const defaultValues: CommitTimeForm = {
    targetTime: committime?.targetTime ? committime.targetTime / 60 : 0,
    deadline: {
      from: committime?.startDate ? fromYmdLocal(committime.startDate) : null,
      to: committime?.endDate ? fromYmdLocal(committime.endDate) : null,
    },
  };

  const onSubmit = async (data: CommitTimeForm) => {
    if (!data.deadline.from || !data.deadline.to) return;

    const payload: UpdateCommittimeRequest = {
      targetTime: Math.round(data.targetTime * 60),
      startDate: toYmdLocal(data.deadline.from),
      endDate: toYmdLocal(data.deadline.to),
    };

    try {
      setIsSubmitting(true);
      await callApi<CommittimeResponse>("/api/committime", "PATCH", payload);
      router.refresh();
      await Promise.all([
        committimeQuery.mutate(),
        committimeSummaryQuery.mutate(),
        recordQuery.mutate(),
      ]);
      onClose();
    } catch (error) {
      console.error("Update committime failed", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay">
      <div className="w-[520px] rounded-3xl bg-white px-10 py-8 shadow-md">
        <BlockTitle title="新しい目標時間を設定する" mode="modal" />
        <Form
          fields={fields}
          buttons={buttons}
          onSubmit={onSubmit}
          schema={commitTimeFormSchema}
          defaultValues={defaultValues}
        />
      </div>
    </div>
  );
};

export default UpdateCommittimeModal;
