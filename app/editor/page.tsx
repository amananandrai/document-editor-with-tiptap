import EditorClient from "./editor-client";

export default function EditorPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Professional Document Editor
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create, edit, and format documents with professional-grade tools. 
            Export to PDF and Word formats with ease.
          </p>
        </header>
        
        <section className="bg-white rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <EditorClient />
        </section>
      </div>
    </div>
  );
}
