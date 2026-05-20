import Image from "next/image";
import Button from "@/app/_components/Button";

type CommittimeAlertProps = {
  targetTime: number | null;
  endDate: string | null;
  onOpenModal: () => void;
};

const CommittimeAlert = ({
  targetTime,
  endDate,
  onOpenModal,
}: CommittimeAlertProps) => {
  const targetHour = targetTime ? Math.floor(targetTime / 60) : 0;

  return (
    <div className="mt-6 rounded-3xl bg-white px-10 py-8">
      <div className="flex items-center gap-3">
        <Image src="/icons/alert.png" alt="alert icon" width={32} height={32} />

        <p className="text-base text-subtitle font-bold">
          目標期間が終了しています
        </p>
      </div>

      <div className="mt-4 text-base text-body font-semibold">
        <p>
          あなたの現在の目標（{targetHour}時間）は {endDate ?? "----"}{" "}
          に終了しました。
        </p>

        <p>新しい目標を設定してから記録を続けましょう！</p>
      </div>

      <div className="mt-8 flex justify-center">
        <Button color="red" className="px-10 py-3" onClick={onOpenModal}>
          新しい目標時間を設定する
        </Button>
      </div>
    </div>
  );
};

export default CommittimeAlert;
