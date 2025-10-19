"use client";
import BackButton from "@/components/ui/backButton";
import EditorClient from "./editor-client";
import { useFocusMode } from "@/components/focus-mode-context";
import { Eye, EyeOff } from "lucide-react";

function EditorContent() {
  const { isFocusMode, toggleFocusMode } = useFocusMode();

  return (
    <section
      className={`transition-all duration-300 ${
        isFocusMode
          ? "bg-gray-100 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-start p-0"
          : "bg-gray-50 dark:bg-slate-800 pt-4 md:pt-16 pb-20"
      }`}
    >
      <div
        className={`transition-all duration-300 mx-auto ${
          isFocusMode ? "w-full h-full" : "w-[95%] md:w-[80%]"
        }`}
      >
        {/* ✅ Only show BackButton & Title in normal mode */}
        {!isFocusMode && (
          <div className="flex flex-col items-start md:flex-row md:justify-between md:items-center gap-8 md:gap-4 mb-8">
            <BackButton />
            <h2 className="text-4xl md:text-5xl font-semibold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Document Editor
            </h2>
          </div>
        )}

        {/* ✅ Show "Enter Focus Mode" only when not in focus mode */}
        {!isFocusMode && (
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleFocusMode}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 shadow-md transition"
            >
              Focus
              <EyeOff size={18} />
            </button>
          </div>
        )}

        {/* ✅ Editor content area */}
        <div
          className={`transition-all duration-300 ${
            isFocusMode
              ? "bg-transparent border-none shadow-none rounded-none w-full h-full"
              : "bg-white rounded-xl shadow-2xl shadow-blue-500 border border-gray-200 dark:border-gray-700 overflow-hidden"
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
