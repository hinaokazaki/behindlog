"use client";
import { FriendLists } from "@/schemas/friend";
import BlockTitle from "../_components/BlockTitle";
import useFetch from "../_hooks/useFetch";
import CommunityCardBase from "./_components/CommunityCardBase";
import Loading from "@/app/_components/Loading";

export default function CommunityPage() {
  const { isLoading, error, data } = useFetch<{ friendList: FriendLists }>(
    "/api/friends",
  );
  if (isLoading) return <Loading />;
  if (error) return <p>エラーが発生しました: {error.message}</p>;
  if (!data) return <p>データがありません</p>;

  const friendLists: FriendLists = data.friendList;

  const friends = [{ name: "Hina" }, { name: "Hina" }];

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
          {friends.map((f) => (
            <CommunityCardBase
              key={f.name}
              name={f.name}
              mode="invitations"
              onClick={onClick}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
