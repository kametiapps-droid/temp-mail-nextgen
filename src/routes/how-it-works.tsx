import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ComingSoon } from "../components/PageShell";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — MyTempMail" },
      { name: "description", content: "How MyTempMail generates disposable email addresses and delivers messages instantly." },
      { property: "og:title", content: "How It Works — MyTempMail" },
      { property: "og:description", content: "Generate, receive, expire — three simple steps." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="How it works" title="Three steps to a clean inbox" description="Generate. Receive. Forget.">
      <ComingSoon />
    </PageShell>
  ),
});
