"use client";
import Image from "next/image";
import React from "react";

type Props = {
  name: string;
  onClick?: () => void;
  mode?: "requestSent" | "requestReceived" | "requestAccepted";
  rightSlot?: React.ReactNode;
};

const CommunityCardBase: React.FC<Props> = ({
  name,
  onClick,
  mode = "requestAccepted",
  rightSlot,
}) => {
  const messageMap = {
    requestSent: {
      imageSrc: "/send.png",
      imageAlt: "招待中",
      comment: "招待中...",
    },
    requestReceived: {
      imageSrc: "/envelope.png",
      imageAlt: "招待が届いています",
      comment: "招待が届いています！",
    },
  };

  const message = mode !== "requestAccepted" ? messageMap[mode] : null;

  return (
    <div className="flex justify-between gap-3">
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 rounded-lg p-3 ${onClick ? "min-w-52 cursor-pointer rounded-xl border-[2px] border-secondary px-4 py-2 font-semibold text-secondary hover:bg-background" : ""}`}
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
        {message && (
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
        )}
      </button>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
};

export default CommunityCardBase;
