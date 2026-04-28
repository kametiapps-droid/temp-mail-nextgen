import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ComingSoon } from "../components/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MyTempMail" },
      { name: "description", content: "About MyTempMail — our mission, our team, our principles." },
      { property: "og:title", content: "About — MyTempMail" },
      { property: "og:description", content: "Why we built a disposable email service." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="About" title="Built to keep inboxes calm" description="A small team, a focused product.">
      <ComingSoon />
    </PageShell>
  ),
});
