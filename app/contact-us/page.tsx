import React from "react";
import { ActionCard, SitePage, type SiteSection } from "@/components/site-page";

const REPO = "https://github.com/amananandrai/document-editor-with-tiptap";

const sections: SiteSection[] = [
  {
    id: "ways-to-reach-us",
    title: "Ways to reach us",
    content: (
      <>
        <p>
          DocuEdit Pro is an open-source project, and all conversation happens on GitHub. Pick
          whatever fits best:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ActionCard
            href={`${REPO}/issues/new`}
            title="Report a bug"
            description="Something broken or behaving unexpectedly."
            tone="bg-tile-rose"
          />
          <ActionCard
            href={`${REPO}/issues/new`}
            title="Request a feature"
            description="An idea that would make the editor more useful."
            tone="bg-tile-sky"
          />
          <ActionCard
            href={`${REPO}/issues`}
            title="Browse open issues"
            description="See whether someone has already asked."
            tone="bg-tile-sage"
          />
          <ActionCard
            href={`${REPO}/blob/main/CONTRIBUTING.md`}
            title="Contribute"
            description="How to set up the project and open a pull request."
            tone="bg-tile-sand"
          />
        </div>
      </>
    ),
  },
  {
    id: "before-you-write",
    title: "Before you write",
    content: (
      <ul>
        <li>
          Check the <a href="/help-center">Help Center</a>. Many questions about saving and
          exporting are answered there.
        </li>
        <li>
          Search the <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">existing issues</a>{" "}
          to avoid duplicates.
        </li>
        <li>
          For bugs, include your browser and the steps that cause the problem. A screenshot helps a
          lot.
        </li>
      </ul>
    ),
  },
  {
    id: "responses",
    title: "Response times",
    content: (
      <p>
        The project is maintained by volunteers, so there’s no guaranteed response time. Clear,
        reproducible reports usually get looked at first.
      </p>
    ),
  },
];

export default function ContactUs() {
  return (
    <SitePage
      eyebrow="Contact"
      title={
        <>
          Get in <span className="marker">touch</span>
        </>
      }
      intro={<p>Questions, bug reports and ideas all go through the project’s GitHub page.</p>}
      sections={sections}
    />
  );
}
