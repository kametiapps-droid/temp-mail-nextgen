import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ComingSoon } from "../components/PageShell";

export const Route = createFileRoute("/what-is-temporary-email")({
  head: () => ({
    meta: [
      { title: "What is Temporary Email? — MyTempMail" },
      { name: "description", content: "A complete guide to temporary, disposable, and throwaway email addresses." },
      { property: "og:title", content: "What is Temporary Email?" },
      { property: "og:description", content: "Learn how disposable email works and why it matters for your privacy." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Guide" title="What is a temporary email?" description="Disposable, throwaway, burner — different names, same idea.">
      <ComingSoon />
    </PageShell>
  ),
});
