"use client";
import { Modal } from "../../_components/Modal";
import { User, Mail } from "lucide-react";
import Button from "@/app/_components/Button";
import { FriendRequestrecord } from "@/schemas/friendRequest";

interface Props {
  isOpen: boolean;
  invitation: FriendRequestrecord | null;
  onClose: () => void;
  onDecline: () => void;
  onAccept: () => void;
  isSubmitting?: boolean;
}

const InvitationModal: React.FC<Props> = ({
  isOpen,
  invitation,
  onClose,
  onDecline,
  onAccept,
  isSubmitting,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {invitation && (
        <div>
          <div>
            <h1 className="mb-6 text-base text-subtitle-top font-bold">
              友達からの招待
            </h1>
            <p className="mb-2 flex flex-wrap items-center text-body sm:text-base">
              あなたに
              <User className="mx-2 h-5 w-5 text-buttonMain" />
              <span className="mr-2 font-bold">{invitation.inviter.name}</span>
              から招待が届いています!
            </p>
            <p className="mb-2 flex items-start text-body sm:text-base">
              <Mail className="mx-2 h-5 w-5 shrink-0 text-buttonMain" />
              <span className="mr-2 break-words font-bold">
                {invitation.message}
              </span>
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-evenly">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onDecline}
              color="main"
              variant="outlined"
              children="拒否"
            />
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onAccept}
              color="main"
              variant="filled"
              children="承認"
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default InvitationModal;
