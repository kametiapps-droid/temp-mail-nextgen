import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "../components/PageShell";
import { getBlogPost, getRelatedPosts, type BlogPost } from "../lib/api";
import { seo, SITE_NAME, SITE_URL } from "../lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    try {
      const post = await getBlogPost(params.slug);
      return { post, notFound: false as const };
    } catch {
      return { post: null, notFound: true as const };
    }
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    if (!post) {
      return seo({
        path: `/blog/${params.slug}`,
        title: "Post not found — MyTempMail Blog",
        description: "The blog post you're looking for could not be found.",
        noIndex: true,
      });
    }
    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      image: post.cover_image ? [post.cover_image] : undefined,
      datePublished: post.published_at,
      dateModified: post.published_at,
      author: { "@type": "Organization", name: SITE_NAME },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${SITE_URL}/blog/${post.slug}`,
      },
      articleSection: post.category,
    };
    return seo({
      path: `/blog/${post.slug}`,
      title: `${post.title} | MyTempMail Blog`,
      description: post.excerpt,
      ogType: "article",
      ogImage: post.cover_image || undefined,
      publishedTime: post.published_at,
      modifiedTime: post.published_at,
      author: SITE_NAME,
      jsonLd: articleLd,
    });
  },
  component: BlogPostPage,
});

// very small markdown-ish renderer for headings/paragraphs/lists
function renderMarkdown(md: string) {
  const blocks = md.split(/\n{2,}/);
  return blocks.map((block, i) => {
    if (/^### /.test(block)) return <h3 key={i} className="mt-6 text-lg font-semibold">{block.replace(/^### /, "")}</h3>;
    if (/^## /.test(block)) return <h2 key={i} className="mt-8 text-2xl font-semibold">{block.replace(/^## /, "")}</h2>;
    if (/^# /.test(block)) return <h1 key={i} className="mt-8 text-3xl font-semibold">{block.replace(/^# /, "")}</h1>;
    if (/^[-*] /m.test(block)) {
      const items = block.split(/\n/).filter((l) => /^[-*] /.test(l)).map((l) => l.replace(/^[-*] /, ""));
      return <ul key={i} className="mt-4 list-disc space-y-1 pl-6 text-muted-foreground">{items.map((it, j) => <li key={j}>{it}</li>)}</ul>;
    }
    if (/^> /.test(block)) return <blockquote key={i} className="mt-4 border-l-2 border-border pl-4 italic text-muted-foreground">{block.replace(/^> /, "")}</blockquote>;
    return <p key={i} className="mt-4 leading-relaxed text-foreground/90">{block}</p>;
  });
}

function BlogPostPage() {
  const { slug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const initialPost = loaderData?.post ?? null;
  const initialNotFound = loaderData?.notFound ?? false;

  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(initialNotFound ? "Post not found" : null);

  useEffect(() => {
    let cancelled = false;
    getRelatedPosts(slug)
      .then((r) => { if (!cancelled) setRelated(r); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (initialPost && initialPost.slug === slug) return;
    let cancelled = false;
    setPost(null);
    setError(null);
    getBlogPost(slug)
      .then((p) => { if (!cancelled) setPost(p); })
      .catch((e) => { if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load post"); });
    return () => { cancelled = true; };
  }, [slug, initialPost]);

  if (error) {
    return (
      <PageShell eyebrow="Blog" title="Post not found">
        <p className="text-sm text-destructive">{error}</p>
        <Link to="/blog" className="mt-4 inline-block text-sm underline">← Back to blog</Link>
      </PageShell>
    );
  }

  if (!post) {
    return (
      <PageShell eyebrow="Blog" title="Loading…">
        <div className="space-y-3">
          <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        </div>
      </PageShell>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-12 sm:pt-16">
      <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">← Blog</Link>
      <p className="mt-6 text-xs uppercase tracking-wide text-muted-foreground">{post.category}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{new Date(post.published_at).toLocaleDateString()}</p>
      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} className="mt-6 w-full rounded-2xl border border-border object-cover" />
      )}
      <article className="prose prose-neutral mt-6 max-w-none">
        {post.content ? renderMarkdown(post.content) : <p className="text-muted-foreground">{post.excerpt}</p>}
      </article>

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-8">
          <h2 className="text-lg font-semibold">Related posts</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.id} className="rounded-xl border border-border bg-card p-4 transition hover:shadow-sm">
                <Link to="/blog/$slug" params={{ slug: r.slug }}>
                  <h3 className="text-sm font-semibold">{r.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
