import useFetch from "./useFetch";
import { Profile } from "@/schemas/me";

export const useProfileQuery = () => {
  return useFetch<{ profile: Profile }>("/api/me");
};
