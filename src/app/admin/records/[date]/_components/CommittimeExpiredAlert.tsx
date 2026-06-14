import { TriangleAlert } from "lucide-react";
import Button from "@/app/_components/Button";

type CommittimeAlertProps = {
  targetTime: number | null;
  endDate: string | null;
  onOpenModal: () => void;
};

const CommittimeExpiredAlert = ({
  targetTime,
  endDate,
  onOpenModal,
}: CommittimeAlertProps) => {
  const targetHour = targetTime ? Math.floor(targetTime / 60) : 0;

  return (
    <div className="mt-6 rounded-3xl bg-white px-4 py-6 shadow-md sm:px-6 sm:py-8">
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" />

        <p className="text-subtitle font-bold sm:text-base">
          目標期間が終了しています
        </p>
      </div>

      <div className="mt-4 space-y-1 text-body font-semibold sm:text-base">
        <p>
          あなたの現在の目標（{targetHour}時間）は {endDate ?? "----"}{" "}
          に終了しました。
        </p>

        <p>新しい目標を設定してから記録を続けましょう！</p>
      </div>

      <div className="mt-6 flex justify-center sm:mt-8">
        <Button
          color="main"
          className="w-full px-6 py-3 sm:w-auto sm:px-10"
          onClick={onOpenModal}
        >
          新しい目標時間を設定する
        </Button>
      </div>
    </div>
  );
};

export default CommittimeExpiredAlert;
