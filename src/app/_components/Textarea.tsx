"use client";
import React from "react";

type TextareaProps = React.ComponentProps<"textarea">;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        {...props}
        ref={ref}
        className={`${className} text-text-base placeholder-text-muted border-border focus:ring-border/30 min-h-[130px] w-full rounded-md border border-base px-4 py-3 text-form-text transition duration-150 ease-in-out focus:outline-none focus:ring`}
      />
    );
  },
);

export default Textarea;
