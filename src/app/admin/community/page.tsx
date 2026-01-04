"use client";
import BlockTitle from "../_components/BlockTitle";
import CommunityCardBase from "./_components/CommunityCardBase";
import Loading from "@/app/_components/Loading";
import { useCommunityData } from "./_hook/useCommunityData";
import { Modal } from "../_components/Modal";
import Image from "next/image";
import { CreateFriendRequest } from "@/schemas/friend";
import SectionTitle from "@/app/_components/SectionTitle";
import Form from "@/app/_components/Form";
import { ButtonProps, FieldProps } from "@/app/_types/type";
import z from "zod";
import DeleteFriendModal from "./_components/DeleteFriendModal";
import { useCommunityModals } from "./_hook/useCommunityModals";
import { useCommunityActions } from "./_hook/useCommunityActions";
import InvitationModal from "./_components/InvitationModal";

const requestSchema = z.object({
  message: z.string().min(1, "メッセージを入力してください"),
  inviteeEmail: z.string().email("メールアドレスを入力してください"),
});

export default function CommunityPage() {
  const modals = useCommunityModals();
  const actions = useCommunityActions();
  const { friendLists, invitations, isLoading, error, refetch } =
    useCommunityData();

  const fields: FieldProps[] = [
    {
      name: "inviteeEmail",
      title: "メールアドレス(友達)",
      type: "email",
      inputProps: { placeholder: "example@.com", autoComplete: "email" },
    },
    {
      name: "message",
      title: "メッセージ",
      type: "textarea",
      inputProps: { placeholder: "友達に招待メッセージを送ろう！" },
    },
  ];

  const buttons: ButtonProps[] = [
    {
      label: "キャンセル",
      className: "",
      type: "button",
      disabled: actions.isSubmitting,
      onClick: modals.closeInvite,
      color: "red",
      variant: "outlined",
    },
    {
      label: "招待リンクを送信",
      className: "",
      type: "submit",
      disabled: actions.isSubmitting,
      color: "red",
      variant: "filled",
    },
  ];

  if (isLoading) return <Loading />;
  if (error) return <p>エラーが発生しました: {error.message}</p>;
  if (!friendLists || !invitations) return <p>データがありません</p>;

  const onClick = () => {
    actions.router.replace("/"); // 友達のダッシュボードページに飛ぶようにする
  };

  const handleRequest = async (data: CreateFriendRequest) => {
    try {
      await actions.invite(data, {
        onSuccess: async () => {
          modals.closeInvite();
          await refetch();
        },
      });
    } catch (error) {
      console.log("友達リクエストの送信に失敗しました");
    }
  };

  const handleAccept = async (friendshipId: number) => {
    try {
      await actions.accept(friendshipId, {
        onSuccess: async () => {
          modals.closeInvitation();
          await refetch();
        },
      });
    } catch (error) {
      console.log("友達の承認に失敗しました");
    }
  };

  const handleDecline = async (friendshipId: number) => {
    try {
      await actions.decline(friendshipId, {
        onSuccess: async () => {
          modals.closeInvitation();
          await refetch();
        },
      });
    } catch (error) {
      console.log("友達リクエストの拒否に失敗しました");
    }
  };

  const onConfirmDelete = async () => {
    if (!modals.selectedFriend) return;
    try {
      await actions.deleteFriend(modals.selectedFriend.id, {
        onSuccess: async () => {
          modals.closeDelete();
          await refetch();
        },
      });
    } catch (error) {
      console.log("友達の削除に失敗しました");
    }
  };

  return (
    <div>
      <SectionTitle title="Community" />
      <section className="mx-auto mb-4 w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
        <BlockTitle title="Friends" />
        <div className="space-y-2">
          {friendLists.map((f) => (
            <>
              <CommunityCardBase
                key={f.friend.id}
                name={f.friend.name ? f.friend.name : f.inviteeEmail}
                mode={
                  f.status === "PENDING" ? "requestSent" : "requestAccepted"
                }
                onClick={f.status === "ACCEPTED" ? onClick : undefined}
                rightSlot={
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      modals.openDelete(f);
                    }}
                    className={`flex items-center justify-center rounded-full p-2`}
                  >
                    <Image
                      src="/delete.png"
                      width={25}
                      height={25}
                      alt="削除"
                      className="mx-2"
                    />
                  </button>
                }
              />
            </>
          ))}
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={modals.openInvite}
            className={`flex items-center gap-2 rounded-lg p-3`}
          >
            <div className="flex">
              <Image
                src="/add.png"
                width={25}
                height={25}
                alt="追加"
                className="mx-2"
              />
              <span className="mr-2 text-base font-bold">新しい友達を招待</span>
            </div>
          </button>
        </div>
      </section>
      <section className="mx-auto w-full min-w-[580px] max-w-[760px] rounded-3xl bg-white p-6 shadow-md">
        <BlockTitle title="Invitations" />
        <div className="space-y-2">
          {invitations ? (
            invitations.map((invitation) => (
              <CommunityCardBase
                key={invitation.inviter.id}
                name={invitation.inviter.name}
                mode="requestReceived"
                onClick={() => modals.openInvitation(invitation)}
              />
            ))
          ) : (
            <p className="mr-2 text-base">招待状はありません。</p>
          )}
        </div>
      </section>

      <DeleteFriendModal
        isOpen={modals.isDeleteOpen}
        friend={modals.selectedFriend}
        onClose={modals.closeDelete}
        onConfirm={onConfirmDelete}
      />
      <Modal isOpen={modals.isInviteOpen} onClose={modals.closeInvite}>
        <div>
          <Form
            fields={fields}
            buttons={buttons}
            schema={requestSchema}
            onSubmit={handleRequest}
          />
        </div>
      </Modal>
      <InvitationModal
        isOpen={modals.isInvitationOpen}
        invitation={modals.selectedInvitation}
        onClose={modals.closeInvitation}
        onDecline={() => {
          if (!modals.selectedInvitation) return;
          handleDecline(modals.selectedInvitation.friendshipId);
        }}
        onAccept={() => {
          if (!modals.selectedInvitation) return;
          handleAccept(modals.selectedInvitation.friendshipId);
        }}
        isSubmitting={actions.isSubmitting}
      />
    </div>
  );
}
