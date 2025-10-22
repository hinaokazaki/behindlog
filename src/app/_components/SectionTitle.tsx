"use client";
import React from "react";

type Props = {
  title: string;
  isPublic?: boolean;
};

const SectionTitle: React.FC<Props> = ({ title, isPublic = false }) => {
  const textPlace = isPublic ? "text-center" : "";
  const lineWidth = isPublic ? "w-[70%]" : "";

  return (
    <div className={`mb-14 ${textPlace}`}>
      <p className="inline-block font-en text-heading-1 font-bold text-primary">
        {title}
        <span className={`mx-auto mt-4 block h-1 ${lineWidth} bg-red-300`} />
      </p>
    </div>
  );
};

export default SectionTitle;
