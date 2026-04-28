import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ComingSoon } from "../components/PageShell";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — MyTempMail" },
      { name: "description", content: "Frequently asked questions about disposable email and MyTempMail." },
      { property: "og:title", content: "FAQ — MyTempMail" },
      { property: "og:description", content: "Answers to the most common questions about disposable email." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="FAQ" title="Frequently asked questions" description="Quick answers to common questions.">
      <ComingSoon />
    </PageShell>
  ),
});
