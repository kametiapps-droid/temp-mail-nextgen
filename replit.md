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

## Conventions

- User communicates in Hindi/English mix; dislikes unsolicited additions — keep changes scoped to what was asked.
- End each user-facing reply with a single bold "Next, I can…" suggestion.
