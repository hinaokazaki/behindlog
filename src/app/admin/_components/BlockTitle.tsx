"use client";
import React from "react";

type Props = {
  title: string;
  mode?: "section" | "modal";
};

const BlockTitle: React.FC<Props> = ({ title, mode = "section" }) => {
  const styles = {
    section: "text-primary text-subtitle-top font-en sm:text-heading-2",
    modal: "text-base text-subtitle-top font-jp",
  };

  return <p className={`mb-3 font-bold ${styles[mode]}`}>{title}</p>;
};

export default BlockTitle;
