import { FriendLists } from "@/schemas/friend";
import useFetch from "../../_hooks/useFetch";
import { FriendRequestrecords } from "@/schemas/friendRequest";

export const useCommunityData = () => {
  const {
    data: friendListsData,
    error: friendsError,
    isLoading: isFriendsLoading,
    mutate: friendListsMutate,
  } = useFetch<{ friendList: FriendLists }>("/api/friends");

  const {
    data: invitationsData,
    error: invitationsError,
    isLoading: isInvitationsLoading,
    mutate: invitationsMutate,
  } = useFetch<{ invitations: FriendRequestrecords }>("/api/friends/requests");

  const refetch = async () => {
    await Promise.all([friendListsMutate(), invitationsMutate()]);
  };

  return {
    friendLists: friendListsData?.friendList ?? [],
    invitations: invitationsData?.invitations ?? [],
    isLoading: isFriendsLoading || isInvitationsLoading,
    error: friendsError || invitationsError,
    refetch,
  };
};
