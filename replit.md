# MyTempMail

Free disposable temporary email web app built on **TanStack Start + React + Vite + Tailwind v4**.

## Dev

- Node 22, `npm run dev` (workflow: `Start application`)
- Vite bound to `0.0.0.0:5000`, `allowedHosts: true` (`vite.config.ts`)

## Structure

- `src/routes/__root.tsx` — root shell, head, no-flash inline script that sets `theme` (dark class), `lang` and `dir` from localStorage before paint. `suppressHydrationWarning` on `<html>` because the script mutates attrs pre-hydration.
- `src/routes/index.tsx` — homepage (Hero, EmailCard, Inbox, WhatIsTempMail, UseCases, FAQ, BlogPreview).
- `src/routes/free-temporary-email-generator|disposable-email-for-verification|temp-mail-for-otp|temp-mail-for-instagram|temp-mail-for-netflix|temp-mail-for-amazon|temp-mail-for-tiktok.tsx` — 7 SEO landing pages.
- `src/routes/blog*`, `src/routes/about|contact|privacy|terms|disclaimer.tsx` — content pages.
- `src/components/Header.tsx`, `Footer.tsx` — chrome (translated). Header includes `LanguageSwitcher` + `ThemeToggle` in desktop and mobile menus; mobile menu auto-closes on scroll/resize.
- `src/components/LanguageSwitcher.tsx` — Globe-icon dropdown listing native language names; RTL-aware (`end-0`).
- `src/components/ThemeToggle.tsx` — toggles `.dark` class and persists to localStorage `theme`.
- `src/lib/i18n.ts` — i18next + react-i18next init. `SUPPORTED_LANGUAGES` (en, ar, hi, zh, ko, fa) with `dir`. `applyLanguageSideEffects` sets `<html lang>` + `<html dir>` and persists to localStorage `lang`.
- `src/locales/{en,ar,hi,zh,ko,fa}.json` — translations for nav/footer/hero/emailCard/inbox/whatIs/useCases/faq/blogPreview/language. SEO landing pages and legal pages are not yet translated.
- `src/lib/api.ts` — Workers API client (Cloudflare); `getBlogPosts()` powers BlogPreview.

## SEO

- `src/lib/seo.ts` — `seo({path,title,description,...})` helper returns `{meta, links, scripts}` with full title/desc, robots, canonical, complete OG, Twitter card, and optional JSON-LD. `SITE_URL`, `SITE_NAME`, `DEFAULT_OG_IMAGE` exported here.
- `src/routes/__root.tsx` — defaults: theme-color, og:site_name, og:locale, twitter:card, default og:image, favicon, robots index/follow + Organization & WebSite JSON-LD.
- Every route's `head()` uses `seo()` for canonical + complete OG/Twitter. Per-page `keywords` where applicable.
- `src/routes/index.tsx` — WebApplication JSON-LD.
- `src/routes/faq.tsx` — FAQPage JSON-LD generated from `groups`.
- `src/routes/blog.$slug.tsx` — TanStack Router `loader` fetches post server-side, then real `head()` (title/desc/og:image from cover_image/article:published_time) + Article JSON-LD. Component hydrates from `Route.useLoaderData()` so first paint already shows the post (good for SEO + UX).
- `public/robots.txt` — allows all, disallows /api/, blocks GPTBot/CCBot, points to sitemap.
- `src/server.ts` — handles `/sitemap.xml` directly: fetches `/api/blog`, returns dynamic XML with all 19 static URLs + every blog post (lastmod from `published_at`). Cached at edge for 6h SWR 24h.

## Cloudflare Worker / caching

- `src/server.ts` — custom Worker wrapping `@tanstack/react-start/server-entry`. Uses Cloudflare **Cache API** (`caches.default`) explicitly to cache HTML responses (Cache-Control headers alone don't cache Worker responses).
- Cache TTLs: homepage 10min edge, static SEO pages 24h, blog posts 12h, sitemap 6h. All with long SWR.
- After deploy, do "Purge Everything" once in Cloudflare dashboard if old broken HTML may be cached.

## Conventions

- User communicates in Hindi/English mix; dislikes unsolicited additions — keep changes scoped to what was asked.
- End each user-facing reply with a single bold "Next, I can…" suggestion.
