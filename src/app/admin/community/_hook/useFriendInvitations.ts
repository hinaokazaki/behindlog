import { FriendRequestrecords } from "@/schemas/friendRequest";
import useFetch from "../../_hooks/useFetch";

export const useFriendInvitations = () => {
  return useFetch<{ invitations: FriendRequestrecords }>(
    "/api/friends/request",
  );
};
