import { TotalStudyTime } from "@/schemas/committime";
import useFetch from "./useFetch";

export const useCommittimeSummaryQuery = () => {
  return useFetch<{ totalStudyTime: TotalStudyTime }>(
    "/api/committime/summary",
  );
};
