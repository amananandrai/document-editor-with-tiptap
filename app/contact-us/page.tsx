import React from "react";

export default function ContactUs() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 text-gray-200">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="mb-8 text-lg text-center">
        Have feedback, questions, or suggestions? The <strong>DocuEdit Pro Support Team</strong> is here to help.
        Reach out to us through our community platforms, or use the form below to share your thoughts.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">1. Ways to Reach Us</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>GitHub Discussions:</strong> Join our developer community to ask questions, share insights, or contribute to open-source development.
          </li>
          <li>
            <strong>Feature Requests:</strong> Have an idea for improvement? Submit your suggestion through  <a href="https://github.com/amananandrai/document-editor-with-tiptap/issues" className="text-indigo-400 underline">Feature Request</a>.
          </li>
          <li>
            <strong>Community Forum:</strong> Engage with other DocuEdit Pro users, explore guides, and troubleshoot issues together.
          </li>
          <li>
            <strong>Documentation:</strong> Visit the <a href="/documentation" className="text-indigo-400 underline">Docs Page</a> for setup instructions and API references.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">2. Feedback Form</h2>
        <p className="mb-4">
          We value your feedback! Please fill out the form below to share your suggestions, report issues, or request assistance.
        </p>
        <form className="space-y-4 bg-gray-900 p-6 rounded-2xl shadow-lg">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="topic" className="block mb-2 text-sm font-medium text-gray-300">
              Topic
            </label>
            <select
              id="topic"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>General Feedback</option>
              <option>Bug Report</option>
              <option>Feature Request</option>
              <option>Account or Access Issue</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Type your message here..."
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Submit Feedback
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">3. Response Time</h2>
        <p className="mb-4">
          Our support team aims to respond within <strong>24–48 hours</strong> on business days. Community discussions and GitHub
          responses may take slightly longer depending on activity.
        </p>
        <p className="italic text-sm text-gray-400">
          Tip: Before submitting a query, check the Help Center and Documentation — your question may already be answered there.
        </p>
      </section>
    </main>
  );
}
