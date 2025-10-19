import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "aos/dist/aos.css";
import { ThemeProvider } from "@/components/theme-provider";
import RootLayoutClient from "@/components/RootLayoutClient"; // ✅ imported

export const metadata: Metadata = {
  title: "DocuEdit Pro - Professional Document Editor",
  description:
    "A powerful, feature-rich document editor built with modern web technologies. Create, edit, and format documents with professional-grade tools.",
  generator: "Next.js",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider>
          <RootLayoutClient>{children}</RootLayoutClient>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
