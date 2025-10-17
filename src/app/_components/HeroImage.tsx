"use client";
import Image from "next/image";

type HeroImageProps = {
  mode?: "lp" | "invite" | "mobile";
};

export const HeroImage = ({ mode = "lp" }: HeroImageProps) => {
  const imageSize = {
    lp: { width: 300, height: 262, fontSize: "text-[70px]" },
    invite: { width: 200, height: 174, fontSize: "text-[50px]" },
    mobile: { width: 200, height: 174, fontSize: "text-[50px]" },
  }[mode];

  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src="/icon.png"
        alt="Behindlog icon"
        width={imageSize.width}
        height={imageSize.height}
        priority
        className="mx-auto mb-2"
      />
      <h1
        className={`font-en text-heading-2 font-bold leading-tight text-primary ${imageSize.fontSize}`}
      >
        Behindlog
      </h1>
    </div>
  );
};
