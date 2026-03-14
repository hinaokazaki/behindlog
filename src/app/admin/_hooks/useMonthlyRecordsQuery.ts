import useFetch from "./useFetch";
import { MonthlyRecords } from "@/schemas/monthlyRecords";

type Props = {
  month: string;
};

export const useMonthlyRecordsQuery = ({ month }: Props) => {
  return useFetch<{ monthlyRecords: MonthlyRecords }>(
    `/api/friends/records?month=${month}`,
  );
};
