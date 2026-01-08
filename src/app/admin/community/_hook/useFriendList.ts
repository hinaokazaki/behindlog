import { FriendLists } from "@/schemas/friend";
import useFetch from "../../_hooks/useFetch";

export const useFriendList = () => {
  return useFetch<{ friendList: FriendLists }>("/api/friends");
};
