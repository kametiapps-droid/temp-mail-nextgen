import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ComingSoon } from "../components/PageShell";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — MyTempMail" },
      { name: "description", content: "Read the MyTempMail disclaimer." },
      { property: "og:title", content: "Disclaimer — MyTempMail" },
      { property: "og:description", content: "Important notes about using MyTempMail." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Legal" title="Disclaimer">
      <ComingSoon />
    </PageShell>
  ),
});
