"use client";
import React from "react";

type Props = {
  title: string;
  isPublic?: boolean;
};

const SectionTitle: React.FC<Props> = ({ title, isPublic = false }) => {
  const textPlace = isPublic ? "text-center mb-14" : "mb-7";
  const lineWidth = isPublic ? "w-[70%]" : "";

  return (
    <div className={textPlace}>
      <p className="inline-block font-en text-heading-3 font-bold text-primary sm:text-heading-1">
        {title}
        <span
          className={`mx-auto mt-2 block h-1 ${lineWidth} bg-secondary sm:mt-4`}
        />
      </p>
    </div>
  );
};

export default SectionTitle;
