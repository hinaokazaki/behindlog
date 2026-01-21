import { useApi } from "@/app/_hooks/useApi";
import {
  CommittimeResponse,
  CreateCommittimeRequest,
  UpdateCommittimeRequest,
} from "@/schemas/committime";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Options = {
  onSuccess?: () => void;
};

export const useCommitTimeActions = () => {
  const { callApi } = useApi();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const create = async (data: CreateCommittimeRequest, opts?: Options) => {
    try {
      setIsSubmitting(true);
      await callApi<CommittimeResponse>("/api/committime", "POST", data);
      router.refresh();
      opts?.onSuccess?.();
    } catch (error) {
      console.error("Create committime failed", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = async (
    committimeId: number,
    data: UpdateCommittimeRequest,
    opts?: Options,
  ) => {
    try {
      setIsSubmitting(true);
      await callApi<CommittimeResponse>(
        `/api/committime/${committimeId}`,
        "PATCH",
        data,
      );
      router.refresh();
      opts?.onSuccess?.();
    } catch (error) {
      console.error("Update committime failed", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { router, isSubmitting, create, update };
};
