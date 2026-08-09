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
  description:
    "Sibsankar De is a Software Developer specializing in high-performance backend systems, Spring Boot REST APIs, and full-stack web applications. Currently interning at Pinggy.io and studying B.Tech IT at JGEC.",

  keywords: [
    "Sibsankar De",
    "Software Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Spring Boot Developer",
    "Next.js Developer",
    "Java Developer",
    "Distributed Systems",
    "REST API",
    "AWS",
    "Jalpaiguri Government Engineering College",
    "JGEC",
    "Pinggy.io",
    "Portfolio",
  ],

  authors: [{ name: "Sibsankar De", url: "https://github.com/Sibsankar-de" }],
  creator: "Sibsankar De",
  publisher: "Sibsankar De",

  alternates: { canonical: "/" },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Sibsankar De",
    title: "Sibsankar De | Software Developer",
    description:
      "Software Developer building high-performance backend systems and full-stack web applications. Spring Boot, Next.js, AWS, and more.",
    url: "/",
    images: [
      {
        url: "/og_image.png",
        width: 1200,
        height: 630,
        alt: "Sibsankar De - Software Developer Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sibsankar De | Software Developer",
    description: "Software Developer building high-performance backend systems and full-stack web applications.",
    images: ["/og_image.png"],
    creator: "@sibsankar_de",
  },

  icons: {
    icon: "/favicon.ico",
  },
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
