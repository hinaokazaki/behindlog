"use client";
import React from "react";
import clsx from "clsx";
import { ButtonProps } from "../_types/type";

const COLORS = {
  green: {
    filled: {
      base: "bg-primary text-white border-primary",
      hover: "hover:bg-primary-hover",
    },
    outlined: {
      base: "bg-background text-primary border-primary",
      hover: "hover:text-primary-hover hover:border-primary-hover",
    },
  },
  red: {
    filled: {
      base: "bg-secondary text-white border-secondary",
      hover: "hover:bg-secondary-hover",
    },
    outlined: {
      base: "bg-background text-secondary border-secondary",
      hover: "hover:text-secondary-hover hover:border-secondary-hover",
    },
  },
};

const Button: React.FC<ButtonProps> = ({
  children, 
  color = "green",
  variant = "filled",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}) => {
  const styleSet = COLORS[color][variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "rounded-xl border-[2px] px-4 py-2 font-semibold",
        "text-body md:text-form-text",
        "transition-colors duration-200",
        styleSet.base,
        !disabled && styleSet.hover,
        disabled &&
          "cursor-not-allowed opacity-50 hover:border-inherit hover:bg-inherit hover:text-inherit",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
