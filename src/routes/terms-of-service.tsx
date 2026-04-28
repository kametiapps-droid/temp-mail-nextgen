import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ComingSoon } from "../components/PageShell";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of Service — MyTempMail" },
      { name: "description", content: "Read the MyTempMail terms of service." },
      { property: "og:title", content: "Terms of Service — MyTempMail" },
      { property: "og:description", content: "The terms governing use of MyTempMail." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Legal" title="Terms of Service">
      <ComingSoon />
    </PageShell>
  ),
});
