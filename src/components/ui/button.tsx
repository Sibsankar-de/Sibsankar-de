import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger";

export function buttonClassName({
  variant = "primary",
  className,
}: { variant?: ButtonVariant; className?: string } = {}) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 border-2 border-line px-4 py-2 font-mono text-xs font-medium uppercase tracking-wide cursor-pointer shadow-[4px_4px_0_var(--line)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60",
    {
      "bg-primary text-primary-foreground": variant === "primary",
      "bg-surface text-ink": variant === "secondary",
      "border-danger bg-canvas text-danger": variant === "danger",
    },
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant };

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={buttonClassName({ variant, className })} {...props} />;
}
