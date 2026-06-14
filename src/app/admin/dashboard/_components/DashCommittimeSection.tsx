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

  return (
    <section className="mx-auto mb-4 w-full min-w-0 max-w-[760px] rounded-3xl bg-white p-4 shadow-md sm:p-6">
      <BlockTitle title="Commit Time" />

      <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-center md:gap-8">
        <div className="h-[170px] w-[170px] shrink-0 md:h-[220px] md:w-[220px] 2xl:h-[180px] 2xl:w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill="var(--color-button-main)" />
                <Cell fill="var(--color-chart-base)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full min-w-0 sm:w-auto">
          <div className="mt-2">
            <p className="text-form-text sm:text-base">目標学習時間</p>

            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-base font-bold">
                {targetTime ? Math.floor(targetTime / 60) : 0}
                <span className="ml-2 text-form-text sm:text-base">時間</span>
              </p>

              <p className="text-xs font-semibold sm:text-sm">
                [{committime?.startDate ?? "----"} -{" "}
                {committime?.endDate ?? "----"}]
              </p>
            </div>
          </div>

          <hr className="my-2" />

          <div>
            <p className="text-form-text sm:text-base">現在の合計学習時間</p>

            <p className="mt-3 text-base font-semibold">
              {Math.floor(totalStudyTimeByPeriod / 60)}
              <span className="mx-2 text-form-text font-medium sm:text-base">
                時間
              </span>
              {totalStudyTimeByPeriod % 60}
              <span className="mx-2 text-form-text font-medium sm:text-base">
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
