import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-ink text-paper hover:bg-neutral-800"
      : "bg-transparent text-ink border border-line hover:bg-neutral-50";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
