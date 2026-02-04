"use client";
import { Modal } from "../../_components/Modal";
import Image from "next/image";
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
            <p className="mb-2 flex items-center text-base text-body">
              あなたに
              <Image
                src="/profile-red.png"
                width={30}
                height={30}
                alt="プロフィール"
                className="mx-2"
              />
              <span className="mr-2 text-base font-bold">
                {invitation.inviter.name}
              </span>
              から招待が届いています!
            </p>
            <p className="mb-2 flex items-center text-base text-body">
              <Image
                src="/message.png"
                width={30}
                height={30}
                alt="メッセージ"
                className="mx-2"
              />
              <span className="mr-2 text-base font-bold">
                {invitation.message}
              </span>
            </p>
          </div>
          <div className="mt-8 flex items-center justify-evenly">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onDecline}
              color="red"
              variant="outlined"
              children="拒否"
            />
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onAccept}
              color="red"
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
