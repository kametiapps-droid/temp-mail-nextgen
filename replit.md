# MyTempMail

Free disposable temporary email web app — instant inbox, custom name/domain, real-time SSE delivery, zero signup.

## Run & Operate

- `npm run dev` → Vite dev server on port 5000 (workflow: `Start application`)
- `npm run build` → production build
- Deploy: `wrangler deploy` (Cloudflare Worker)
- Required env vars: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_WORKER_NAME`, `CLOUDFLARE_EMAIL_WORKER_NAME`

## Stack

- **Framework**: TanStack Start (React 19 + TanStack Router file-based routing)
- **Runtime**: Node 22, Vite 7, deployed as Cloudflare Worker (`src/server.ts`)
- **Styling**: Tailwind CSS v4 (no Radix UI — removed)
- **Icons**: lucide-react
- **i18n**: i18next + react-i18next (EN, AR, HI, ZH, KO, FA)
- **State**: Custom email-store with BroadcastChannel cross-tab sync + SSE

## Where things live

- `src/routes/__root.tsx` — root shell, org/website JSON-LD, no-flash theme script
- `src/routes/index.tsx` — homepage (Hero, EmailCard, Inbox, WhatIs, UseCases, FAQ, BlogPreview)
- `src/routes/blog.$slug.tsx` — SSR blog posts via TanStack loader
- `src/routes/[19 SEO pages].tsx` — landing + legal + content pages
- `src/lib/seo.ts` — `seo()` helper, `SITE_URL`, `SITE_NAME`, `DEFAULT_OG_IMAGE`
- `src/lib/api.ts` — Cloudflare Worker API client + SSE
- `src/lib/email-store.ts` — cross-tab leader election + inbox state
- `src/server.ts` — Cloudflare Worker entry: SSR, caching (Cache API), sitemap.xml
- `public/og-image.png` — 1200×630 OG/social share image
- `public/logo.png` — site logo (152KB PNG)
- `public/robots.txt` — allows Googlebot, blocks AI scrapers

## Architecture decisions

- **Cloudflare Cache API** used explicitly (not just Cache-Control headers) — Workers bypass CDN cache otherwise
- **No shadcn/ui** — all 35 Radix UI components removed; pages use plain Tailwind + lucide only
- **SSR via TanStack Start** — full HTML served on first request; Google sees complete content
- **Leader election** in email-store.ts — only one tab maintains the SSE connection
- **No user auth** — anonymous by design; no login, no sessions, no DB from frontend

## Product

- Generate disposable email (custom name + domain choice)
- Real-time inbox via SSE (Server-Sent Events)
- 7 SEO landing pages (Instagram, Netflix, Amazon, TikTok, OTP, verification, generator)
- Blog (fetched from `mytempmail-api` Cloudflare Worker)
- 6-language i18n with RTL support (AR, FA)
- Dark/light mode with no-flash localStorage script

## User preferences

- Hindi/English mix in conversation
- No unsolicited changes — keep scope tight
- End each reply with bold "Next, I can…" suggestion

## Gotchas

- `og-image.png` must be in `public/` — currently using banner image (87KB)
- `favicon.svg` does NOT exist — use `logo.png` everywhere
- www redirect: Cloudflare Redirect Rule deployed (301 www→root) ✅
- Always HTTPS + HSTS enabled via Cloudflare API ✅
- After Cloudflare deploy, run "Purge Everything" if stale HTML cached
- Domain is ~13 days old — ranking on page 50 is expected; give it 3-6 months

## Pointers

- Cloudflare Zone ID: `a46fb5cc583ba9c2b3835238041aeaef`
- Workers: `mytempmail-api` (API), `temp-mail-nextgen` (frontend SSR)
- Free tier usage: ~800 req/day (limit: 100k/day) — very safe
