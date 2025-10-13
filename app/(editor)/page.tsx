import EditorClient from "./editor-client";
import { ThemeToggle } from "@/components/theme-toggle";

export default function EditorPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center gap-4">
        <div>
          <h1 className="text-balance text-2xl font-semibold">Document Editor</h1>
          <p className="text-sm text-muted-foreground">
            A Tiptap-based rich text editor with Google Docs–like features.
          </p>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>
      <section>
        <EditorClient />
      </section>
    </main>
  );
}
