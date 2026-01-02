import { useState } from "react";
import { FriendList } from "@/schemas/friend";

type Invitation = {
  friendshipId: number;
  inviter: { id: string; name: string | null };
  message: string;
};

export const useCommunityModals = () => {
  // 招待送信モーダル
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const openInvite = () => setIsInviteOpen(true);
  const closeInvite = () => setIsInviteOpen(false);

  // 招待詳細（承認/拒否）モーダル
  const [selectedInvitation, setSelectedInvitation] =
    useState<Invitation | null>(null);
  const openInvitation = (invitation: Invitation) =>
    setSelectedInvitation(invitation);
  const closeInvitation = () => setSelectedInvitation(null);

  // 友達削除モーダル
  const [selectedFriend, setSelectedFriend] = useState<FriendList | null>(null);
  const openDelete = (friend: FriendList) => setSelectedFriend(friend);
  const closeDelete = () => setSelectedFriend(null);

  return {
    // 招待送信モーダル
    isInviteOpen,
    openInvite,
    closeInvite,

    // 招待詳細（承認/拒否）モーダル
    selectedInvitation,
    isInvitationOpen: !!selectedInvitation,
    openInvitation,
    closeInvitation,

    // 友達削除モーダル
    selectedFriend,
    isDeleteOpen: !!selectedFriend,
    openDelete,
    closeDelete,
  };
};
