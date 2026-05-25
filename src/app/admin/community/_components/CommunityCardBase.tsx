"use client";
import { User, SendHorizontal } from "lucide-react";
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
          <User className="mx-2 h-5 w-5 text-primary" />
          <span className="mr-2 text-base font-bold">{name}</span>
        </div>
        {message && (
          <div className="flex">
            <SendHorizontal className="mx-2 h-5 w-5 text-secondary" />
            <span className="mr-2 text-base">{message.comment}</span>
          </div>
        )}
      </button>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
};

export default CommunityCardBase;
