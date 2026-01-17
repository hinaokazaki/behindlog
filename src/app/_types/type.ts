export type Option = {
  value: string;
  label: string;
};

export type FieldProps = {
  name: string;
  title: string;
  type: "text" | "textarea" | "select" | "date" | "dateRange" | "email" | "password";
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  options?: Option[];
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "green" | "red";
  variant?: "filled" | "outlined";
  type?: "button" | "submit";
  isLoading?: boolean;
};
