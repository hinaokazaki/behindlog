"use client";
import { User } from "lucide-react";
import React from "react";
import { Modal } from "../../_components/Modal";
import { FriendList } from "@/schemas/friend";
import Button from "@/app/_components/Button";

interface Props {
  isOpen: boolean;
  friend: FriendList | null;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

const DeleteFriendModal: React.FC<Props> = ({
  isOpen,
  friend,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {friend && (
        <div>
          <div>
            <h1 className="mb-6 text-base text-subtitle-top font-bold">
              友達の削除
            </h1>
            <p className="mb-2 flex flex-wrap items-center text-body sm:text-base">
              <User className="mr-2 h-5 w-5 shrink-0 text-buttonMain" />
              <span className="mr-2 break-words font-bold">
                {friend.friend ? friend.friend.name : friend.inviteeEmail}
              </span>
              を友達リストから削除しますか？
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-evenly">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              color="main"
              variant="outlined"
            >
              キャンセル
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onConfirm}
              color="main"
              variant="filled"
            >
              友達リストから削除
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DeleteFriendModal;
