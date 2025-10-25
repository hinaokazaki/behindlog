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
    friends: {
      imageSrc: "/send.png",
      imageAlt: "招待中",
      comment: "招待中...",
    },
    invitations: {
      imageSrc: "/envelope.png",
      imageAlt: "招待が届いています",
      comment: "招待が届いています！",
    },
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
      <div className="flex">
        <Image
          src={message.imageSrc}
          width={30}
          height={30}
          alt={message.imageAlt}
          className="mx-2"
        />
        <span className="mr-2 text-base">{message.comment}</span>
      </div>
    </div>
  );
};

export default CommunityCardBase;
