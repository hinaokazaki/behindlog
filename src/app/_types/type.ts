export type Option = {
  value: string;
  label: string;
};

export type FieldProps = {
  name: string;
  title: string;
  type: "text" | "textarea" | "select" | "date" | "email" | "password";
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  options?: Option[];
};

export type ButtonProps = {
  label: string;
  color?: "green" | "red";
  variant?: "filled" | "outlined";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  isLoading?: boolean;
};
