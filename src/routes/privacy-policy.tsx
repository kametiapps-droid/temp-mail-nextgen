import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ComingSoon } from "../components/PageShell";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MyTempMail" },
      { name: "description", content: "Read the MyTempMail privacy policy." },
      { property: "og:title", content: "Privacy Policy — MyTempMail" },
      { property: "og:description", content: "How we handle your data." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Legal" title="Privacy Policy">
      <ComingSoon />
    </PageShell>
  ),
});
