import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ComingSoon } from "../components/PageShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MyTempMail" },
      { name: "description", content: "Get in touch with the MyTempMail team." },
      { property: "og:title", content: "Contact — MyTempMail" },
      { property: "og:description", content: "Reach out for questions, feedback, or partnerships." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Contact" title="Get in touch" description="We'd love to hear from you.">
      <ComingSoon />
    </PageShell>
  ),
});
