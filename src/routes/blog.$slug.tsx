import { createFileRoute } from "@tanstack/react-router";
import { PageShell, ComingSoon } from "../components/PageShell";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — MyTempMail Blog` },
      { name: "description", content: `Read "${params.slug}" on MyTempMail.` },
      { property: "og:title", content: params.slug },
      { property: "og:type", content: "article" },
    ],
  }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  return (
    <PageShell eyebrow="Blog" title={slug.replace(/-/g, " ")}>
      <ComingSoon note="Post content coming soon." />
    </PageShell>
  );
}
