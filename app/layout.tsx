import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import RootLayoutClient from "@/components/RootLayoutClient"; // ✅ imported

// Display face for marketing headlines (variable width for the expanded cut)
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DocuEdit Pro - Document editor with real pages",
  description:
    "Write on real A4 pages with headers, footers, page numbers, equations and multilevel lists, then export to PDF or Word. Free, no sign-up.",
  generator: "Next.js",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${archivo.variable}`}>
        <ThemeProvider>
          <RootLayoutClient>{children}</RootLayoutClient>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
