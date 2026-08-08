import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse border-2 border-line bg-canvas/70 shadow-[2px_2px_0_var(--line)]", className)}
      {...props}
    />
  );
}
