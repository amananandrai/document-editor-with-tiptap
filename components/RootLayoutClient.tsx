"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { recordPageView } from "@/lib/navigation-history";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import BackToTopButton from "@/components/BackToTopButton"; // 👈 add this import

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  useEffect(() => {
    recordPageView();
  }, [pathname]);
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

      {/* 👇 Show Back To Top button only outside editor pages */}
      {!isEditor && <BackToTopButton />}
    </div>
  );
}

