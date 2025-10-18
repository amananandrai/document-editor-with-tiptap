import React from "react";

export default function HelpCenter() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Help Center</h1>
      <p className="mb-8 text-lg text-center">
        Need assistance? The <strong>DocuEdit Pro Help Center</strong> provides answers to common questions, troubleshooting steps, and guidance for reporting issues or suggesting new features.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">1. Frequently Asked Questions (FAQ)</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>How do I save my work?</strong><br />
            DocuEdit Pro automatically saves your progress in real time. You can also manually click the <em>Save</em> button in the toolbar.
          </li>
          <li>
            <strong>Can I use the editor offline?</strong><br />
            Yes, DocuEdit Pro supports offline editing through local caching. Your changes will sync once you reconnect to the internet.
          </li>
          <li>
            <strong>How do I export a document?</strong><br />
            Use the <em>Export</em> button at the top right to download your document as a PDF or Word file.
          </li>
          <li>
            <strong>Does the editor support collaboration?</strong><br />
            Real-time collaboration is in active development and will be released in a future update.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">2. Troubleshooting</h2>
        <p className="mb-4">
          Encountering an issue? Here are some quick tips to resolve common problems.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Editor not loading properly:</strong> Clear your browser cache and refresh the page. Ensure you’re using the latest version of Chrome or Firefox.
          </li>
          <li>
            <strong>Missing toolbar buttons:</strong> Go to <em>Settings → Toolbar Options</em> and re-enable any hidden features.
          </li>
          <li>
            <strong>Export not working:</strong> Make sure you’ve granted file download permissions to your browser.
          </li>
          <li>
            <strong>Fonts not displaying correctly:</strong> Verify that your system supports web fonts or try using a different font theme in settings.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">3. Reporting a Bug</h2>
        <p className="mb-4">
          If you discover a bug or unexpected behavior, we appreciate your help in improving DocuEdit Pro. Please include the following details when reporting:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>A clear description of the issue.</li>
          <li>Steps to reproduce it (if possible).</li>
          <li>Your operating system and browser version.</li>
          <li>A screenshot or video recording (optional but helpful).</li>
        </ul>
        <p className="mt-4">
          You can report issues via our <a href="https://github.com/amananandrai/document-editor-with-tiptap/issues" className="text-indigo-400 underline">GitHub Issues</a> page or send feedback directly from the in-app <em>Help → Report a Bug</em> option.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">4. Feature Requests</h2>
        <p className="mb-4">
          We value your feedback! If there’s a feature you’d like to see in future versions, submit a request through our <a href="https://github.com/amananandrai/document-editor-with-tiptap/issues" className="text-indigo-400 underline">Feature Request Form</a>.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide a short summary of your idea.</li>
          <li>Explain how it would improve your workflow.</li>
          <li>Include any mockups or examples if available.</li>
        </ul>
        <p className="mt-4 italic text-sm text-gray-400">
          Our team reviews all suggestions regularly and prioritizes features based on community votes.
        </p>
      </section>
    </main>
  );
}
