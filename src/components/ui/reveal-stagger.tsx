import { RevealBlock } from "@/components/ui/reveal-block";

interface RevealStaggerProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "left" | "right";
}

export function RevealStagger({
  children,
  className,
  staggerDelay = 0.08,
  direction = "up",
}: RevealStaggerProps) {
  return (
    <>
      {children.map((child, i) => (
        <RevealBlock
          className={className}
          delay={i * staggerDelay}
          direction={direction}
          key={i}
        >
          {child}
        </RevealBlock>
      ))}
    </>
  );
}
