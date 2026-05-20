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
};

const CommittimeRecordForm = ({
  displayCommittime,
  totalStudyTimeByPeriod,
  register,
}: CommittimeRecordFormProps) => {
  return (
    <>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-base text-form-text">目標学習時間</p>
          <p className="ml-4 mt-4 text-base font-bold">
            {displayCommittime.targetTime
              ? Math.floor(displayCommittime.targetTime / 60)
              : 0}
            <span className="ml-8 text-base text-form-text">時間</span>
          </p>
        </div>

        <p className="text-sm font-semibold">
          [{displayCommittime.startDate ?? "----"} -{" "}
          {displayCommittime.endDate ?? "----"}]
        </p>
      </div>

      <div className="mt-4 border-t border-gray-200" />

      <div className="mt-4 grid grid-cols-2 gap-8">
        <div>
          <p className="text-base text-form-text">今日の学習時間</p>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0"
                className="w-20 rounded-md border-2 p-2 text-center"
                {...register("studyHours")}
              />
              <span className="text-base text-form-text font-medium">時間</span>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0"
                inputMode="numeric"
                min={0}
                max={59}
                className="w-20 rounded-md border-2 p-2 text-center"
                {...register("studyMinutes")}
              />
              <span className="text-base text-form-text font-medium">分</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-base text-form-text">合計学習時間</p>
          <p className="mt-4 text-base font-semibold">
            {Math.floor(totalStudyTimeByPeriod / 60)}
            <span className="mx-4 text-base text-form-text font-medium">
              時間
            </span>
            {totalStudyTimeByPeriod % 60}
            <span className="mx-4 text-base text-form-text font-medium">
              分
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default CommittimeRecordForm;
