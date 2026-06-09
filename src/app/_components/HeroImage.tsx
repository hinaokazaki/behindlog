"use client";
import Image from "next/image";
import clsx from "clsx";

type HeroImageProps = {
  mode?: "lp" | "invite" | "mobile" | "footer";
};

export const HeroImage = ({ mode = "lp" }: HeroImageProps) => {
  const isFooter = mode === "footer";

  const imageSize = {
    lp: { width: 300, height: 262, fontSize: "text-[65px]" },
    invite: { width: 200, height: 174, fontSize: "text-[50px]" },
    mobile: { width: 200, height: 174, fontSize: "text-[50px]" },
    footer: { width: 300, height: 262, fontSize: "text-[40px]" },
  }[mode];

  return (
    <div
      className={clsx(
        "flex items-center justify-center",
        isFooter ? "flex-row gap-3" : "flex-col",
      )}
    >
      <Image
        src="/icon.png"
        alt="Behindlog icon"
        width={imageSize.width}
        height={imageSize.height}
        priority
        className={clsx(
          "object-contain",
          isFooter ? "h-[70px] w-[80px]" : "mx-auto mb-2",
        )}
      />

      <h1
        className={clsx(
          "font-en font-bold leading-tight",
          imageSize.fontSize,
          isFooter ? "text-white" : "text-primary",
        )}
      >
        Behindlog
      </h1>
    </div>
  );
};
