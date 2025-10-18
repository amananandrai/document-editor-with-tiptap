"use client";
import EditorClient from "./editor-client";

export default function EditorPage() {
  return (
    <section className="w-[95%] md:w-[80%] mx-auto mt-16 mb-20">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
        Document Editor
      </h2>

      <div className="bg-white rounded-xl shadow-2xl shadow-blue-500 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <EditorClient />
      </div>
    </section>
  );
}