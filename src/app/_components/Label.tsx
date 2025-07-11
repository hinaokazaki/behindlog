"use client";
import React from "react";

type Props = {
  name: string;
  title: string;
};

const Label: React.FC<Props> = ({ name, title }) => {
  return (
    <label
      htmlFor={name}
      className="mb-1.5 block text-base text-form-text font-medium"
    >
      {title}
    </label>
  );
};

export default Label;
