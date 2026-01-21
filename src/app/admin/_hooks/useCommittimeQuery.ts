import { Committime } from "@/schemas/committime";
import useFetch from "./useFetch";

export const useCommittimeQuery = () => {
  return useFetch<{ committime: Committime }>("/api/committime");
};
