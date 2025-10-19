"use client";
import BackButton from "@/components/ui/backButton";
import EditorClient from "./editor-client";

export default function EditorPage() {
  return (
    <section className="bg-gray-50 dark:bg-slate-800 pt-4 md:pt-16 pb-20">
      <div className="w-[95%] md:w-[80%] mx-auto">
        <div className="flex flex-col items-start md:flex-row md:justify-between md:items-center gap-8 md:gap-4 mb-8">
          <BackButton />

          <h2 className="text-4xl md:text-5xl font-semibold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Document Editor
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-2xl shadow-blue-500 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <EditorClient />
        </div>
      </div>
    </section>
  );
}