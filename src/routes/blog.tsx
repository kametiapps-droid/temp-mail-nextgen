import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "../components/PageShell";
import { getBlogPosts, type BlogPost } from "../lib/api";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — MyTempMail" },
      { name: "description", content: "Articles, tips, and updates on email privacy and disposable email." },
      { property: "og:title", content: "Blog — MyTempMail" },
      { property: "og:description", content: "Articles, tips, and updates on email privacy." },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getBlogPosts()
      .then((p) => { if (!cancelled) setPosts(p); })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load posts"); });
    return () => { cancelled = true; };
  }, []);

  return (
    <PageShell eyebrow="Blog" title="Notes on privacy & email" description="Posts, guides, and updates.">
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}
      {!posts && !error && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-border bg-muted/40" />
          ))}
        </div>
      )}
      {posts && posts.length === 0 && (
        <p className="text-sm text-muted-foreground">No posts yet.</p>
      )}
      {posts && posts.length > 0 && (
        <ul className="grid gap-5 sm:grid-cols-2">
          {posts.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-sm">
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="block">
                {p.cover_image && (
                  <img src={p.cover_image} alt={p.title} loading="lazy" className="h-44 w-full object-cover" />
                )}
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{p.category}</p>
                  <h2 className="mt-1 text-lg font-semibold leading-snug">{p.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{new Date(p.published_at).toLocaleDateString()}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
