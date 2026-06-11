import { TotalStudyTime } from "@/schemas/committime";
import useFetch from "./useFetch";

export const useCommittimeSummaryQuery = (date?: string) => {
  const query = date ? `?date=${date}` : "";
  return useFetch<{ totalStudyTime: TotalStudyTime }>(
    `/api/committime/summary${query}`,
  );
};
