import { useApi } from "@/app/_hooks/useApi";
import { FriendResponse } from "@/schemas/friend";
import { useRouter } from "next/navigation";
import { useState } from "react";

type InvitePayload = { message: string; inviteeEmail: string };

type Options = {
  onSuccess?: () => void;
};

export const useCommunityActions = () => {
  const { callApi } = useApi();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invite = async (data: InvitePayload, opts?: Options) => {
    try {
      setIsSubmitting(true);
      await callApi<FriendResponse>("/api/friends/invite", "POST", data);
      router.refresh();
      opts?.onSuccess?.();
    } catch (error) {
      console.error("invite failed", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const accept = async (friendshipId: number, opts?: Options) => {
    try {
      setIsSubmitting(true);
      await callApi<FriendResponse>(`/api/friends/${friendshipId}`, "PATCH");
      router.refresh();
      opts?.onSuccess?.();
    } catch (error) {
      console.error("友達の承認に失敗しました", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const decline = async (friendshipId: number, opts?: Options) => {
    try {
      setIsSubmitting(true);
      await callApi<FriendResponse>(`/api/friends/${friendshipId}`, "DELETE");
      router.refresh();
      opts?.onSuccess?.();
    } catch (error) {
      console.error("友達リクエストの拒否に失敗しました", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteFriend = async (friendshipId: number, opts?: Options) => {
    try {
      setIsSubmitting(true);
      await callApi<FriendResponse>(`/api/friends/${friendshipId}`, "DELETE");
      router.refresh();
      opts?.onSuccess?.();
    } catch (error) {
      console.error("友達の削除に失敗しました", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { router, isSubmitting, invite, accept, decline, deleteFriend };
};
