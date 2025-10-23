"use client";

import { FocusModeProvider } from "@/components/focus-mode-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FocusModeProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </FocusModeProvider>
  );
}
