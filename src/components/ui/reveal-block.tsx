"use client";

import { motion, useReducedMotion } from "framer-motion";

interface RevealBlockProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
  distance?: number;
}

export function RevealBlock({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 24,
}: RevealBlockProps) {
  const shouldReduce = useReducedMotion();

  const axis =
    direction === "up"
      ? { y: distance, x: 0 }
      : direction === "left"
        ? { x: -distance, y: 0 }
        : { x: distance, y: 0 };

  return (
    <motion.div
      className={className}
      initial={shouldReduce ? false : { opacity: 0, ...axis }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ once: false, margin: "-60px" }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
