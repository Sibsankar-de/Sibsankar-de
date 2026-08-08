import Image from "next/image";
import { cn } from "@/lib/utils";

export function MyImage({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      alt="Sibsankar De"
      className={cn("h-auto w-full object-contain", className)}
      height={1931}
      priority={priority}
      src="/my-image.png"
      width={1246}
    />
  );
}
