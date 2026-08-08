import type { Metadata } from "next";
import { DM_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Sibsankar De | Software Developer",
    template: "%s | Sibsankar De",
  },
  description: "Software developer building reliable backend systems and thoughtful full-stack products.",
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${dmMono.variable} min-h-screen bg-canvas font-sans text-ink`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
