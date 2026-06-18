"use client";
import React from "react";

type InputProps = React.ComponentProps<"input">;

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      className="text-text-base placeholder-text-muted border-border focus:ring-border/30 w-full rounded-md border border-base px-4 py-3 text-form-text transition duration-150 ease-in-out focus:outline-none focus:ring"
      {...props}
      ref={ref}
    />
  );
});

Input.displayName = "Input";

export default Input;
