"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

type Props = {
  iconWidth?: number;
  iconHeight?: number;
  fontSize?: string;
};

const Logo: React.FC<Props> = ({
  iconWidth = 60,
  iconHeight = 52,
  fontSize = "text-heading-2",
}) => {
  return (
    <Link href="/" className="flex items-center space-x-3">
      <Image
        src="/icon.png"
        alt="Behindlog logo"
        width={iconWidth}
        height={iconHeight}
      />
      <span className={`font-bold text-primary ${fontSize} font-en`}>
        Behindlog
      </span>
    </Link>
  );
};

export default Logo;
