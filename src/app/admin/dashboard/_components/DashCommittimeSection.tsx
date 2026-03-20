"use client";

import Loading from "@/app/_components/Loading";
import { useCommittimeQuery } from "../../_hooks/useCommittimeQuery";
import BlockTitle from "../../_components/BlockTitle";
import { useCommittimeSummaryQuery } from "../../_hooks/useCommittimeSummaryQuery";

const DashCommittimeSection: React.FC = () => {
  const committimeQuery = useCommittimeQuery();
  const committimeSummaryQuery = useCommittimeSummaryQuery();

  if (committimeQuery.isLoading || committimeSummaryQuery.isLoading)
    return <Loading />;

  if (committimeQuery.error)
    return (
      <p>
        目標時間の取得でエラーが発生しました: {committimeQuery.error.message}
      </p>
    );

  if (committimeQuery.error)
    return (
      <p>
        合計時間の取得でエラーが発生しました:{" "}
        {committimeSummaryQuery.error.message}
      </p>
    );

  const committime = committimeQuery.data
    ? committimeQuery.data.committime
    : null;

  const committimeSummary = committimeSummaryQuery.data
    ? committimeSummaryQuery.data.totalStudyTime
    : null;

  const totalStudyTimeByPeriod =
    committimeSummaryQuery.data?.totalStudyTime.totalStudyTimeByPeriod ?? 0;

  return (
    <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
      <BlockTitle title="Commit Time" />
      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-base text-form-text">目標学習時間</p>
          <p className="ml-4 mt-4 text-base font-bold">
            {committime?.targetTime
              ? Math.floor(committime.targetTime / 60)
              : 0}
            <span className="ml-8 text-base text-form-text">時間</span>
          </p>
        </div>

        <p className="text-base text-sm font-semibold">
          [{committime?.startDate ?? "----"} - {committime?.endDate ?? "----"}]
        </p>
      </div>
      <div>
        <p className="text-base text-form-text">現在の合計学習時間</p>
        <p className="mt-4 text-base font-semibold">
          {Math.floor(totalStudyTimeByPeriod / 60)}
          <span className="mx-4 text-base text-form-text font-medium">
            時間
          </span>
          {totalStudyTimeByPeriod % 60}
          <span className="mx-4 text-base text-form-text font-medium">分</span>
        </p>
      </div>
    </section>
  );
};

export default DashCommittimeSection;
