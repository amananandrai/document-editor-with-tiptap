"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { hasInAppHistory } from "@/lib/navigation-history";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    // Go back only to a page of this site; otherwise (opened directly or
    // from another site) go to the home page instead of leaving.
    if (hasInAppHistory()) router.back();
    else router.push("/");
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex cursor-pointer items-center gap-2 border-2 border-ink px-4 py-2.5 font-display text-xs font-extrabold uppercase tracking-[0.05em] text-ink transition-colors [font-stretch:110%] hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Back
    </button>
  );
}
