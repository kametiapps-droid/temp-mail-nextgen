import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ComingSoon } from "../components/PageShell";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — MyTempMail" },
      { name: "description", content: "Articles, tips, and updates from the MyTempMail team." },
      { property: "og:title", content: "Blog — MyTempMail" },
      { property: "og:description", content: "Articles, tips, and updates on email privacy." },
    ],
  }),
  component: () => (
    <PageShell eyebrow="Blog" title="Notes on privacy & email" description="Posts, guides, and updates.">
      <ComingSoon note="No posts yet. Check back soon." />
    </PageShell>
  ),
});
