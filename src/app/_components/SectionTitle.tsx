"use client";
import React from "react";

type Props = {
  title: string;
};

const SectionTitle: React.FC<Props> = ({ title }) => {
  return (
    <div className="mb-14 text-center">
      <p className="inline-block font-en text-heading-1 font-bold text-primary">
        {title}
        <span className="mx-auto mt-4 block h-1 w-[70%] bg-red-300" />
      </p>
    </div>
  );
};

export default SectionTitle;
