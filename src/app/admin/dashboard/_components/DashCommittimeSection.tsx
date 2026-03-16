"use client";

import Loading from "@/app/_components/Loading";
import { useCommittimeQuery } from "../../_hooks/useCommittimeQuery";
import BlockTitle from "../../_components/BlockTitle";

const DashCommittimeSection: React.FC = () => {
  const committimeQuery = useCommittimeQuery();

  if (committimeQuery.isLoading) return <Loading />;
  if (committimeQuery.error)
    return (
      <p>
        目標時間の取得でエラーが発生しました: {committimeQuery.error.message}
      </p>
    );

  const committime = committimeQuery.data?.committime;

  return (
    <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
      <BlockTitle title="Commit Time" />
    </section>
  );
};

export default DashCommittimeSection;
