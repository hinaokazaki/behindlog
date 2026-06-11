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
            <p className="mb-2 flex items-center text-base text-body">
              <User className="mr-2 h-5 w-5 text-buttonMain" />
              <span className="mr-2 text-base font-bold">
                {friend.friend ? friend.friend.name : friend.inviteeEmail}
              </span>
              を友達リストから削除しますか？
            </p>
          </div>
          <div className="mt-8 flex items-center justify-evenly">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              color="main"
              variant="outlined"
              children="キャンセル"
            />
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onConfirm}
              color="main"
              variant="filled"
              children="友達リストから削除"
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DeleteFriendModal;
