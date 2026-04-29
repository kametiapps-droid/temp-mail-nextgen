import handler from "@tanstack/react-start/server-entry";

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

export default {
  async fetch(request: Request, env: unknown, ctx: Ctx): Promise<Response> {
    const url = new URL(request.url);
    const cacheControl = getCacheControl(url.pathname);
    const isCacheable = request.method === "GET" && cacheControl !== null;

    const cache = (globalThis as unknown as { caches: { default: Cache } }).caches?.default;

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
