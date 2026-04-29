export const SITE_URL = "https://mytempmail.pro";
export const SITE_NAME = "MyTempMail";
export const SITE_TWITTER = "@mytempmail";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface SeoOptions {
  path: string;
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

type MetaTag = Record<string, string>;
type LinkTag = Record<string, string>;
type ScriptTag = Record<string, string>;

export function seo(opts: SeoOptions): {
  meta: MetaTag[];
  links: LinkTag[];
  scripts: ScriptTag[];
} {
  const url = `${SITE_URL}${opts.path}`;
  const ogImage = opts.ogImage || DEFAULT_OG_IMAGE;

  const meta: MetaTag[] = [
    { title: opts.title },
    { name: "description", content: opts.description },
    { name: "robots", content: opts.noIndex ? "noindex, nofollow" : "index, follow" },
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:url", content: url },
    { property: "og:type", content: opts.ogType || "website" },
    { property: "og:image", content: ogImage },
    { property: "og:site_name", content: SITE_NAME },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: ogImage },
  ];

  if (opts.keywords) meta.push({ name: "keywords", content: opts.keywords });
  if (opts.publishedTime)
    meta.push({ property: "article:published_time", content: opts.publishedTime });
  if (opts.modifiedTime)
    meta.push({ property: "article:modified_time", content: opts.modifiedTime });
  if (opts.author) meta.push({ property: "article:author", content: opts.author });

  const links: LinkTag[] = [{ rel: "canonical", href: url }];

  const scripts: ScriptTag[] = [];
  if (opts.jsonLd) {
    const items = Array.isArray(opts.jsonLd) ? opts.jsonLd : [opts.jsonLd];
    for (const item of items) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(item),
      });
    }
  }

  return { meta, links, scripts };
}
