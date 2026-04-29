import handler from "@tanstack/react-start/server-entry";

const SITE_URL = "https://mytempmail.pro";
const API_URL = "https://mytempmail-api.kametiapps.workers.dev";

const STATIC_SEO_PATHS = new Set([
  "/about",
  "/contact",
  "/disclaimer",
  "/privacy-policy",
  "/terms-of-service",
  "/faq",
  "/features",
  "/how-it-works",
  "/use-cases",
  "/what-is-temporary-email",
  "/free-temporary-email-generator",
  "/disposable-email-for-verification",
  "/temp-mail-for-otp",
  "/temp-mail-for-instagram",
  "/temp-mail-for-netflix",
  "/temp-mail-for-amazon",
  "/temp-mail-for-tiktok",
  "/blog",
]);

const STATIC_CACHE = "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800";
const HOMEPAGE_CACHE = "public, max-age=60, s-maxage=600, stale-while-revalidate=3600";
const BLOG_POST_CACHE = "public, max-age=300, s-maxage=43200, stale-while-revalidate=86400";
const SITEMAP_CACHE = "public, max-age=300, s-maxage=21600, stale-while-revalidate=86400";

function getCacheControl(pathname: string): string | null {
  const path = pathname.replace(/\/$/, "") || "/";

  if (path === "/") return HOMEPAGE_CACHE;
  if (STATIC_SEO_PATHS.has(path)) return STATIC_CACHE;
  if (path.startsWith("/blog/")) return BLOG_POST_CACHE;

  return null;
}

type Ctx = { waitUntil: (promise: Promise<unknown>) => void };

const tanstackFetch = (
  handler as { fetch: (req: Request, env: unknown, ctx: Ctx) => Promise<Response> }
).fetch;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface BlogPostMin {
  slug: string;
  published_at?: string;
}

async function buildSitemap(): Promise<string> {
  const today = new Date().toISOString().split("T")[0];

  const staticUrls: { loc: string; priority: string; changefreq: string; lastmod: string }[] = [
    { loc: "/", priority: "1.0", changefreq: "daily", lastmod: today },
    { loc: "/features", priority: "0.8", changefreq: "monthly", lastmod: today },
    { loc: "/how-it-works", priority: "0.8", changefreq: "monthly", lastmod: today },
    { loc: "/use-cases", priority: "0.8", changefreq: "monthly", lastmod: today },
    { loc: "/what-is-temporary-email", priority: "0.8", changefreq: "monthly", lastmod: today },
    { loc: "/free-temporary-email-generator", priority: "0.9", changefreq: "monthly", lastmod: today },
    { loc: "/disposable-email-for-verification", priority: "0.8", changefreq: "monthly", lastmod: today },
    { loc: "/temp-mail-for-otp", priority: "0.8", changefreq: "monthly", lastmod: today },
    { loc: "/temp-mail-for-instagram", priority: "0.7", changefreq: "monthly", lastmod: today },
    { loc: "/temp-mail-for-netflix", priority: "0.7", changefreq: "monthly", lastmod: today },
    { loc: "/temp-mail-for-amazon", priority: "0.7", changefreq: "monthly", lastmod: today },
    { loc: "/temp-mail-for-tiktok", priority: "0.7", changefreq: "monthly", lastmod: today },
    { loc: "/faq", priority: "0.7", changefreq: "monthly", lastmod: today },
    { loc: "/about", priority: "0.5", changefreq: "yearly", lastmod: today },
    { loc: "/contact", priority: "0.5", changefreq: "yearly", lastmod: today },
    { loc: "/blog", priority: "0.8", changefreq: "weekly", lastmod: today },
    { loc: "/privacy-policy", priority: "0.3", changefreq: "yearly", lastmod: today },
    { loc: "/terms-of-service", priority: "0.3", changefreq: "yearly", lastmod: today },
    { loc: "/disclaimer", priority: "0.3", changefreq: "yearly", lastmod: today },
  ];

  let posts: BlogPostMin[] = [];
  try {
    const res = await fetch(`${API_URL}/api/blog`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = (await res.json()) as BlogPostMin[];
      if (Array.isArray(data)) posts = data;
    }
  } catch {
    // ignore — sitemap still useful with static pages
  }

  const urls = [
    ...staticUrls.map(
      (u) =>
        `  <url>\n    <loc>${SITE_URL}${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    ),
    ...posts.map((p) => {
      const lastmod = (p.published_at || "").split("T")[0] || today;
      return `  <url>\n    <loc>${SITE_URL}/blog/${xmlEscape(p.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`;
    }),
  ].join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export default {
  async fetch(request: Request, env: unknown, ctx: Ctx): Promise<Response> {
    const url = new URL(request.url);
    const cache = (globalThis as unknown as { caches: { default: Cache } }).caches?.default;

    // Dynamic sitemap.xml — generated from static URLs + live blog posts
    if (url.pathname === "/sitemap.xml" && request.method === "GET") {
      const cacheKey = new Request(url.toString(), { method: "GET" });
      if (cache) {
        const cached = await cache.match(cacheKey);
        if (cached) {
          const headers = new Headers(cached.headers);
          headers.set("X-Cache", "HIT");
          return new Response(cached.body, { status: cached.status, headers });
        }
      }
      const xml = await buildSitemap();
      const response = new Response(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": SITEMAP_CACHE,
          "CDN-Cache-Control": SITEMAP_CACHE,
          "X-Cache": "MISS",
        },
      });
      if (cache) ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    const cacheControl = getCacheControl(url.pathname);
    const isCacheable = request.method === "GET" && cacheControl !== null;

    if (isCacheable && cache) {
      const cacheKey = new Request(url.toString(), { method: "GET" });
      const cached = await cache.match(cacheKey);
      if (cached) {
        const headers = new Headers(cached.headers);
        headers.set("X-Cache", "HIT");
        return new Response(cached.body, {
          status: cached.status,
          statusText: cached.statusText,
          headers,
        });
      }
    }

    const response = await tanstackFetch(request, env, ctx);
    const contentType = response.headers.get("content-type") ?? "";

    if (
      isCacheable &&
      cache &&
      response.status === 200 &&
      contentType.includes("text/html")
    ) {
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", cacheControl!);
      headers.set("CDN-Cache-Control", cacheControl!);
      headers.set("X-Cache", "MISS");

      const body = await response.arrayBuffer();
      const cachedResponse = new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
      const cacheKey = new Request(url.toString(), { method: "GET" });
      ctx.waitUntil(cache.put(cacheKey, cachedResponse.clone()));
      return cachedResponse;
    }

    return response;
  },
};
