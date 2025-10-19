"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditor = pathname.startsWith("/editor");

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Hide navbar/footer only for editor route */}
      {!isEditor && <Navbar />}
      <main className="flex-1">
        {children}
        <Toaster />
      </main>
      {!isEditor && <Footer />}
    </div>
  );
}
