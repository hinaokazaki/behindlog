"use client";
import React from "react";

type TextareaProps = React.ComponentProps<"textarea">;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        {...props}
        ref={ref}
        className={`placeholder-text-muted focus:ring-border/30 min-h-[130px] w-full rounded-xl border border-base px-4 py-3 text-form-text transition duration-150 ease-in-out focus:outline-none focus:ring sm:text-form-text ${className} `}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
