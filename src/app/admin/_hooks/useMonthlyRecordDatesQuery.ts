import { MonthlyRecordDates } from "@/schemas/monthlyRecordDates";
import useFetch from "./useFetch";

type Props = {
  month: string;
};

export const useMonthlyRecordDatesQuery = ({ month }: Props) => {
  return useFetch<{ monthlyRecordDates: MonthlyRecordDates }>(
    `/api/records/[userId]/monthly?month=${month}`,
  );
};
