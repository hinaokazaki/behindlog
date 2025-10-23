"use client";
import BlockTitle from "../_components/BlockTitle";
import CommunityCardBase from "./_components/CommunityCardBase";

export default function CommunityPage() {
  const friends = [{ name: "Hina" }, { name: "Hina" }];

  const onClick = () => {};

  return (
    <div>
      <section>
        <BlockTitle title="Friends" />
        <div className="space-y-2">
          {friends.map((f) => (
            <CommunityCardBase key={f.name} name={f.name} mode="friends" />
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
