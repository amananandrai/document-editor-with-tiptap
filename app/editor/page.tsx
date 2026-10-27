"use client";
import BackButton from "@/components/ui/backButton";
import EditorClient from "./editor-client";
import { useFocusMode } from "@/components/focus-mode-context";
import { EyeOff } from "lucide-react";

function EditorContent() {
  const { isFocusMode, toggleFocusMode } = useFocusMode();

  return (
    <section
      className={`transition-all duration-300 ${isFocusMode
        ? "bg-gray-200 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-start p-0"
        : "bg-paper text-ink pt-6 md:pt-10 pb-16"
        }`}
    >
      <div
        className={`transition-all duration-300 mx-auto ${isFocusMode ? "w-full h-full" : "w-[95%] md:w-[88%]"
          }`}
      >
        {/* Header row: back, title, focus mode (hidden in focus mode) */}
        {!isFocusMode && (
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
            <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
              <BackButton />
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">
                  Saves automatically in this browser
                </p>
                <h2 className="mt-1 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-black uppercase leading-[0.9] tracking-[-0.02em] [font-stretch:112%]">
                  Document <span className="marker">editor</span>
                </h2>
              </div>
            </div>

            <button
              onClick={toggleFocusMode}
              title="Focus mode (Ctrl+Shift+F)"
              className="inline-flex cursor-pointer items-center gap-2 bg-mark px-4 py-3 font-display text-xs font-extrabold uppercase tracking-[0.05em] text-mark-ink transition-transform [font-stretch:110%] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <EyeOff size={16} aria-hidden="true" />
              Focus mode
            </button>
          </div>
        )}

        {/* ✅ Editor content area */}
        <div
          className={`transition-all duration-300 ${isFocusMode
            ? "bg-transparent border-none shadow-none rounded-none w-full h-full"
            : "bg-white rounded-xl border-2 border-ink overflow-hidden"
            }`}
        >
          <EditorClient />
        </div>
      </div>
    </section>
  );
}

export default function EditorPage() {
  return <EditorContent />;
}
