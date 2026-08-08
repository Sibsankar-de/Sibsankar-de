import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "mt-1 w-full border-2 border-line bg-canvas px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus:border-primary",
        className,
      )}
      {...props}
    />
  );
}
