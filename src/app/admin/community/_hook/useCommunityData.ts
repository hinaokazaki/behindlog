import { FriendLists } from "@/schemas/friend";
import useFetch from "../../_hooks/useFetch";
import { FriendRequestrecords } from "@/schemas/friendRequest";

export const useCommunityData = () => {
  const {
    data: friendListsData,
    error: friendsError,
    isLoading: isFriendsLoading,
  } = useFetch<{ friendList: FriendLists }>("/api/friends");

  const {
    data: invitationsData,
    error: invitationsError,
    isLoading: isInvitationsLoading,
  } = useFetch<{ invitations: FriendRequestrecords }>("/api/friends/requests");

  return {
    friendLists: friendListsData?.friendList ?? [],
    invitations: invitationsData?.invitations ?? [],
    isLoading: isFriendsLoading || isInvitationsLoading,
    error: friendsError || invitationsError,
  };
};
