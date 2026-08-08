import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-2 border-line bg-surface shadow-[4px_4px_0_var(--line)]", className)} {...props} />;
}
