export type FieldProps = {
  name: string;
  title: string;
  type: "text" | "email" | "password" | "textarea";
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>;
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

// API
// User
export type ProfileData = {
  id: string;
  email: string;
  name: string | null;
  colorTheme: "ORIGINAL" | "COOL" | "WARM" | "NATURE" | "SUNSHINE" | null;
  createdAt: Date;
  updatedAt: Date;
};

// Goal
export type GoalData = {
  id: number;
  title: string;
  deadline: Date;
};
