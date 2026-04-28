import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ComingSoon } from "../components/PageShell";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — MyTempMail" },
      { name: "description", content: "Everything MyTempMail offers: instant disposable emails, auto-expiry, no signup, real-time inbox." },
      { property: "og:title", content: "Features — MyTempMail" },
      { property: "og:description", content: "Instant disposable emails with real-time inbox and auto-expiry." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Features" title="Built for privacy, fast by default" description="A focused toolkit for disposable email — without the noise.">
      <ComingSoon />
    </PageShell>
  ),
});
