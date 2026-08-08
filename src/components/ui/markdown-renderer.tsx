import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("markdown-body text-ink", className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mt-8 mb-4 border-b-2 border-line pb-2 text-3xl font-bold tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-7 mb-3 text-2xl font-bold tracking-tight text-ink">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-2 text-xl font-bold text-ink">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-4 mb-2 text-lg font-bold text-ink">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-base leading-8 text-muted">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-2 pl-6 text-base leading-7 text-muted">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal space-y-2 pl-6 text-base leading-7 text-muted">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-secondary bg-surface p-4 font-mono text-sm italic text-ink shadow-[3px_3px_0_var(--line)]">
              {children}
            </blockquote>
          ),
          code: ({ className: codeClassName, children, ...props }) => {
            const isBlock = codeClassName?.includes("language-") || String(children).includes("\n");
            if (isBlock) {
              return (
                <div className="my-6 overflow-hidden border-2 border-line bg-surface shadow-[4px_4px_0_var(--line)]">
                  <div className="flex items-center justify-between border-b-2 border-line bg-canvas px-4 py-1.5 font-mono text-[10px] uppercase text-muted">
                    <span>Code</span>
                    <span>MD</span>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-xs text-ink leading-6">
                    <code className={codeClassName} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              );
            }
            return (
              <code
                className="border border-line bg-surface px-1.5 py-0.5 font-mono text-xs font-semibold text-secondary"
                {...props}
              >
                {children}
              </code>
            );
          },
          a: ({ href, children }) => (
            <a
              className="font-medium text-secondary underline underline-offset-4 hover:text-ink"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto border-2 border-line shadow-[4px_4px_0_var(--line)]">
              <table className="w-full border-collapse bg-surface text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-2 border-line bg-canvas p-3 font-mono text-xs font-bold uppercase text-left text-ink">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-2 border-line p-3 font-mono text-xs text-muted">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-t-2 border-line" />,
          img: ({ src, alt }) => (
            <div className="my-6 border-2 border-line bg-surface p-2 shadow-[4px_4px_0_var(--line)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={alt || "Project media"} className="max-h-[500px] w-auto mx-auto object-contain" src={src} />
              {alt && (
                <p className="mt-2 text-center font-mono text-[11px] text-muted">
                  {alt}
                </p>
              )}
            </div>
          ),
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
