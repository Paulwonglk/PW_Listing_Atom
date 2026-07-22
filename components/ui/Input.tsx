import { InputHTMLAttributes, forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string };

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, className = "", id, ...props }, ref) => {
    return (
      <label className="block">
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-ink ${className}`}
          {...props}
        />
      </label>
    );
  }
);
Input.displayName = "Input";
