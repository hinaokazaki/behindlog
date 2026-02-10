"use client";
import React from "react";

type Props = {
  title: string;
  mode?: "section" | "modal";
};

const BlockTitle: React.FC<Props> = ({ title, mode = "section" }) => {
  const styles = {
    section: "text-primary text-heading-2 font-en",
    modal: "text-base text-heading-3 font-jp",
  };

  return <p className={`mb-3 font-bold ${styles[mode]}`}>{title}</p>;
};

export default BlockTitle;
