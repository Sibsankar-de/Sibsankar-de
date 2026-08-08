"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  defaultValue?: string;
  name?: string;
  required?: boolean;
  rows?: number;
  className?: string;
}

export function MarkdownEditor({
  defaultValue = "",
  name = "body",
  required = false,
  className,
}: MarkdownEditorProps) {
  const [value, setValue] = useState(defaultValue);
  const { resolvedTheme } = useTheme();
  const colorMode = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div className={cn("border-2 border-line bg-surface p-2 shadow-[4px_4px_0_var(--line)]", className)}>
      <div data-color-mode={colorMode}>
        <MDEditor
          height={480}
          onChange={(val) => setValue(val || "")}
          preview="live"
          value={value}
        />
      </div>
      <input name={name} required={required} type="hidden" value={value} />
    </div>
  );
}
