import useFetch from "./useFetch";
import { FriendDashboard } from "@/schemas/friendDashboard";

type Props = {
  id: string;
};

export const useFriendDashboardQuery = ({ id }: Props) => {
  return useFetch<{ friendDashboard: FriendDashboard }>(
    `/api/users/${id}/dashboard`,
  );
};
