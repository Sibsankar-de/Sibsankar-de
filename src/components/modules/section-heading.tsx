import { cn } from "@/lib/utils";
import { RevealBlock } from "@/components/ui/reveal-block";

export function SectionHeading({ index, title, className }: { index: string; title: string; className?: string }) {
  return (
    <div className={cn("mb-8 flex items-end justify-between gap-4 border-b-2 border-line pb-3", className)}>
      <RevealBlock direction="left">
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">{title}</h2>
      </RevealBlock>
      <span className="shrink-0 font-mono text-xs font-medium text-muted">{index}</span>
    </div>
  );
}
