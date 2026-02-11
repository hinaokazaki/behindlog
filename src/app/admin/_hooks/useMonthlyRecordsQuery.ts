import useFetch from "./useFetch";
import { MonthlyRecords } from "@/schemas/monthlyRecords";

export const useMonthlyRecordsQuery = () => {
  return useFetch<{ monthlyRecords: MonthlyRecords }>("/api/friends/records");
};
