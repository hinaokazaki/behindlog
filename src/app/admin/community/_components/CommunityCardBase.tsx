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
    <div className="flex items-start gap-2">
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full min-w-0 flex-col gap-2 rounded-lg p-3 text-left sm:flex-row sm:items-center ${
          onClick
            ? "cursor-pointer rounded-xl border-[2px] border-secondary px-4 py-2 font-semibold text-secondary hover:bg-background"
            : ""
        }`}
      >
        <div className="flex min-w-0 items-center">
          <User className="mx-2 h-5 w-5 shrink-0 text-buttonMain" />
          <span className="truncate text-base font-bold sm:text-base">
            {name}
          </span>
        </div>

        {message && (
          <div className="flex items-center sm:ml-4">
            <SendHorizontal className="mx-2 h-5 w-5 shrink-0 text-buttonMain" />
            <span className="text-base text-xs sm:text-base">
              {message.comment}
            </span>
          </div>
        )}
      </button>

      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
};

export default CommunityCardBase;
