import { MonthlyRecordDates } from "@/schemas/monthlyRecordDates";
import useFetch from "./useFetch";

type Props = {
  userId: string;
  month: string;
};

export const useMonthlyRecordDatesQuery = ({ userId, month }: Props) => {
  return useFetch<{ monthlyRecordDates: MonthlyRecordDates }>(
    `/api/records/users/${userId}/monthly?month=${month}`,
  );
};
