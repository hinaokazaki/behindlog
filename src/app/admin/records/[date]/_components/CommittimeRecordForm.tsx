import Input from "@/app/_components/Input";
import { UseFormRegister } from "react-hook-form";

type RecordForm = {
  memo: string;
  studyHours: string;
  studyMinutes: string;
  todoItems: {
    date: string;
    items: {
      id: number;
      title: string;
      isCompleted: boolean;
      dueDate: string | null;
    }[];
  };
};

type CommittimeRecordFormProps = {
  displayCommittime: {
    targetTime?: number | null;
    startDate?: string | null;
    endDate?: string | null;
  };
  totalStudyTimeByPeriod: number;
  register: UseFormRegister<RecordForm>;
  disabled?: boolean;
};

const CommittimeRecordForm = ({
  displayCommittime,
  totalStudyTimeByPeriod,
  register,
  disabled = false,
}: CommittimeRecordFormProps) => {
  return (
    <>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-form-text sm:text-base">目標学習時間</p>
          <p className="mt-3 text-base font-bold sm:ml-4 sm:mt-4">
            {displayCommittime.targetTime
              ? Math.floor(displayCommittime.targetTime / 60)
              : 0}
            <span className="ml-3 text-form-text sm:ml-8 sm:text-base">
              時間
            </span>
          </p>
        </div>

        <p className="text-xs font-semibold sm:text-sm">
          [{displayCommittime.startDate ?? "----"} -{" "}
          {displayCommittime.endDate ?? "----"}]
        </p>
      </div>

      <div className="mt-4 border-t border-gray-200" />

      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <div>
          <p className="text-form-text sm:text-base">今日の学習時間</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0"
                className="w-20 rounded-md border-2 p-2 text-center"
                disabled={disabled}
                {...register("studyHours")}
              />
              <span className="text-form-text font-medium sm:text-base">
                時間
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0"
                inputMode="numeric"
                min={0}
                max={59}
                className="w-20 rounded-md border-2 p-2 text-center"
                disabled={disabled}
                {...register("studyMinutes")}
              />
              <span className="text-form-text font-medium sm:text-base">
                分
              </span>
            </div>
          </div>

          {disabled && (
            <p className="mt-2 text-primary">
              この日の学習時間は記録時点の目標に紐づいているため編集できません
            </p>
          )}
        </div>

        <div>
          <p className="text-form-text sm:text-base">合計学習時間</p>
          <p className="mt-4 text-base font-semibold">
            {Math.floor(totalStudyTimeByPeriod / 60)}
            <span className="mx-2 text-form-text font-medium sm:mx-4 sm:text-base">
              時間
            </span>
            {totalStudyTimeByPeriod % 60}
            <span className="mx-2 text-form-text font-medium sm:mx-4 sm:text-base">
              分
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default CommittimeRecordForm;
