"use client";
import BlockTitle from "../../_components/BlockTitle";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type DashCommittimeSectionProps = {
  totalStudyTime: {
    totalStudyTimeByPeriod: number;
    targetTime: number;
    startDate: string;
    endDate: string;
  } | null;
};

const DashCommittimeSection: React.FC<DashCommittimeSectionProps> = ({
  totalStudyTime,
}) => {
  const committime = totalStudyTime;

  const totalStudyTimeByPeriod = committime?.totalStudyTimeByPeriod ?? 0;

  const targetTime = committime?.targetTime ?? 0;

  const studiedMinutes = Math.min(totalStudyTimeByPeriod, targetTime);
  const remainingMinutes = Math.max(targetTime - totalStudyTimeByPeriod, 0);

  const chartData = [
    { name: "学習済み", value: studiedMinutes },
    { name: "残り", value: remainingMinutes },
  ];

  const progressPercent =
    targetTime > 0
      ? Math.min((totalStudyTimeByPeriod / targetTime) * 100, 100)
      : 0;

  return (
    <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
      <BlockTitle title="Commit Time" />
      <div className="flex gap-8">
        <div className="flex items-center justify-between gap-8">
          <div className="h-[180px] w-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#F58C7B" />
                  <Cell fill="#E9DB9B" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-base text-form-text">目標学習時間</p>
              <div className="flex items-baseline gap-4">
                <p className="mt-4 text-base font-bold">
                  {targetTime ? Math.floor(targetTime / 60) : 0}
                  <span className="ml-4 text-base text-form-text">時間</span>
                </p>
                <p className="text-base text-sm font-semibold">
                  [{committime?.startDate ?? "----"} -{" "}
                  {committime?.endDate ?? "----"}]
                </p>
              </div>
            </div>
          </div>
          <hr className="my-1" />
          <div>
            <p className="text-base text-form-text">現在の合計学習時間</p>
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
      </div>
    </section>
  );
};

export default DashCommittimeSection;
