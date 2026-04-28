import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ComingSoon } from "../components/PageShell";

export const Route = createFileRoute("/use-cases")({
  head: () => ({
    meta: [
      { title: "Use Cases — MyTempMail" },
      { name: "description", content: "When to use a disposable email: signups, downloads, free trials, online forms, and more." },
      { property: "og:title", content: "Use Cases — MyTempMail" },
      { property: "og:description", content: "Signups, trials, downloads, forms — keep your real inbox safe." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Use cases" title="When disposable email saves the day" description="Real-world scenarios where a temp address beats a real one.">
      <ComingSoon />
    </PageShell>
  ),
});
