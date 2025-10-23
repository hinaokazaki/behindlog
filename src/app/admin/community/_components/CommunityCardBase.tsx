"use client";
import Image from "next/image";
import React from "react";

type Props = {
  name: string;
  onClick?: () => void;
  mode?: "friends" | "invitations";
};

const CommunityCardBase: React.FC<Props> = ({
  name,
  onClick,
  mode = "friends",
}) => {
  const message = {
    friends: (
      <div className="flex">
        <Image
          src="/send.png"
          width={30}
          height={30}
          alt="招待中"
          className="mx-2"
        />
        <span className="mr-2 text-base">招待中...</span>
      </div>
    ),
    invitations: (
      <div className="flex">
        <Image
          src="/envelope.png"
          width={30}
          height={30}
          alt="招待が届いています"
          className="mx-2"
        />
        <span className="mr-2 text-base">招待が届いています！</span>
      </div>
    ),
  }[mode];

  return (
    <div
      className={`flex items-center gap-2 rounded-lg p-3 ${onClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
    >
      <div className="flex">
        <Image
          src="/profile-red.png"
          width={30}
          height={30}
          alt="プロフィール"
          className="mx-2"
        />
        <span className="mr-2 text-base font-bold">{name}</span>
      </div>
      {message}
    </div>
  );
};

export default CommunityCardBase;
