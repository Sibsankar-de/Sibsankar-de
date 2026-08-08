"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <Button
      aria-label={`Switch to ${nextTheme} mode`}
      className={`grid size-11 min-h-0 place-items-center p-0 shadow-[3px_3px_0_var(--line)] ${className ?? ""}`}
      onClick={() => setTheme(nextTheme)}
      type="button"
      variant="secondary"
    >
      {resolvedTheme === "dark" ? <Sun aria-hidden="true" size={19} /> : <Moon aria-hidden="true" size={19} />}
    </Button>
  );
}
