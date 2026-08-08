import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonClassName } from "@/components/ui/button";

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: "primary" | "secondary" };

export function ButtonLink({ className, variant = "primary", ...props }: ButtonLinkProps) {
  return <Link className={buttonClassName({ variant, className })} {...props} />;
}
