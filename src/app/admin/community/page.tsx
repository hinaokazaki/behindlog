"use client";
import BlockTitle from "../_components/BlockTitle";
import CommunityCardBase from "./_components/CommunityCardBase";
import Loading from "@/app/_components/Loading";
import { useCommunityData } from "./_hook/useCommunityData";

export default function CommunityPage() {
  const { friendLists, invitations, isLoading, error } = useCommunityData();
  if (isLoading) return <Loading />;
  if (error) return <p>エラーが発生しました: {error.message}</p>;
  if (!friendLists || !invitations) return <p>データがありません</p>;

  const onClick = () => {};

  return (
    <div>
      <section>
        <BlockTitle title="Friends" />
        <div className="space-y-2">
          {friendLists.map((f) => (
            <CommunityCardBase
              key={f.friend.id}
              name={f.friend.name ? f.friend.name : f.inviteeEmail}
              mode="friends"
            />
          ))}
        </div>
      </section>
      <section>
        <BlockTitle title="Invitations" />
        <div className="space-y-2">
          {invitations.map((i) => (
            <CommunityCardBase
              key={i.inviter.id}
              name={i.inviter.name}
              mode="invitations"
              onClick={onClick}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
