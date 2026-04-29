import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Mail,
  ShieldCheck,
  Trash2,
  Lock,
  UserX,
  Download,
  ShoppingBag,
  Newspaper,
  Gamepad2,
  Briefcase,
  ChevronDown,
  Sparkles,
  Clock,
  EyeOff,
} from "lucide-react";
import {
  createEmail,
  deleteEmail,
  DEFAULT_DOMAIN,
  getBlogPosts,
  getDomains,
  markRead,
  TURNSTILE_SITE_KEY,
  type BlogPost,
  type InboxMessage,
} from "../lib/api";
import {
  applyIncoming,
  clearEmail,
  markMessageRead,
  setEmail,
  useEmailStore,
  useInboxStream,
} from "../lib/email-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Free Temporary Email — Instant Disposable Inbox | MyTempMail" },
      { name: "description", content: "Generate a free disposable email address instantly. Pick a custom name and domain. No registration. Avoid spam and keep your real inbox clean." },
      { property: "og:title", content: "MyTempMail — Free Disposable Temporary Email" },
      { property: "og:description", content: "Instant disposable email with custom name & domain. No signup. Free forever." },
    ],
  }),
  component: HomePage,
});

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "error-callback"?: () => void }) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

function useTurnstileToken(active: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!active || !TURNSTILE_SITE_KEY) return;
    const id = "cf-turnstile-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
    let attempts = 0;
    const tick = setInterval(() => {
      attempts++;
      if (window.turnstile && ref.current && !widgetId.current) {
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: TURNSTILE_SITE_KEY!,
          callback: (t) => setToken(t),
          "error-callback": () => setToken(null),
        });
        clearInterval(tick);
      }
      if (attempts > 50) clearInterval(tick);
    }, 200);
    return () => {
      clearInterval(tick);
      if (widgetId.current && window.turnstile) {
        try { window.turnstile.remove(widgetId.current); } catch {}
        widgetId.current = null;
      }
      setToken(null);
    };
  }, [active]);

  const reset = useCallback(() => {
    setToken(null);
    if (window.turnstile && widgetId.current) window.turnstile.reset(widgetId.current);
  }, []);

  return { token, ref, reset };
}

function HomePage() {
  const { t } = useTranslation();
  const { email, inbox } = useEmailStore();
  useInboxStream();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => inbox.find((m) => m.id === selectedId) || null, [inbox, selectedId]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Custom dialog state
  const [customOpen, setCustomOpen] = useState(false);
  const [customLocal, setCustomLocal] = useState("");
  const [customDomain, setCustomDomain] = useState(DEFAULT_DOMAIN);
  const [domains, setDomains] = useState<string[]>([DEFAULT_DOMAIN]);

  // Captcha is needed only when there is no email yet (creation flow)
  const captchaActive = !email;
  const { token: tsToken, ref: tsRef, reset: tsReset } = useTurnstileToken(captchaActive);

  useEffect(() => {
    getDomains().then(setDomains).catch(() => {});
  }, []);

  const create = useCallback(
    async (opts: { localPart?: string; domain?: string }) => {
      setLoading(true);
      setError(null);
      try {
        if (TURNSTILE_SITE_KEY && !tsToken) {
          setError("Please complete the captcha first.");
          setLoading(false);
          return;
        }
        const e = await createEmail({
          localPart: opts.localPart,
          domain: opts.domain,
          turnstileToken: tsToken || undefined,
        });
        setEmail(e);
        setSelectedId(null);
        setCustomOpen(false);
        setCustomLocal("");
        tsReset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate email");
      } finally {
        setLoading(false);
      }
    },
    [tsToken, tsReset]
  );

  const copy = useCallback(async () => {
    if (!email) return;
    await navigator.clipboard.writeText(email.email_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [email]);

  const remove = useCallback(async () => {
    if (!email) return;
    if (!confirm(t("emailCard.deleteConfirm"))) return;
    try { await deleteEmail(email.id); } catch {}
    clearEmail();
    setSelectedId(null);
  }, [email, t]);

  const open = useCallback(async (msg: InboxMessage) => {
    setSelectedId(msg.id);
    if (!msg.is_read) {
      markMessageRead(msg.id);
      try { await markRead(msg.id); } catch {}
      // refresh-style: update store with the read flag
      applyIncoming([{ ...msg, is_read: true }]);
    }
  }, []);

  const expiresIn = useMemo(() => {
    if (!email) return null;
    const ms = new Date(email.expires_at).getTime() - Date.now();
    if (ms <= 0) return "expired";
    const min = Math.floor(ms / 60000);
    return `${min} min`;
  }, [email]);

  const validLocal = /^[a-z0-9._-]{1,32}$/.test(customLocal.toLowerCase());

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-12 sm:pt-20">
      {/* Hero */}
      <section className="text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> {t("hero.badge")}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          {t("hero.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          {t("hero.subtitle")}
        </p>
      </section>

      {/* Email card */}
      <section className="mt-10">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          {email ? (
            <>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <div className="flex-1 overflow-hidden rounded-xl bg-muted px-4 py-3">
                  <p className="truncate font-mono text-base sm:text-lg">{email.email_address}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={copy}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    {copied ? t("emailCard.copied") : t("emailCard.copy")}
                  </button>
                  <button
                    onClick={remove}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-destructive hover:text-destructive-foreground"
                  >
                    {t("emailCard.delete")}
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {t("emailCard.expiresIn")} <span className="font-medium text-foreground">{expiresIn}</span> · {t("emailCard.liveInbox")} · {t("emailCard.syncedTabs")}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">{t("emailCard.noEmail")}</p>
              {TURNSTILE_SITE_KEY && <div ref={tsRef} />}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => create({})}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? t("emailCard.generating") : t("emailCard.generate")}
                </button>
                <button
                  onClick={() => setCustomOpen((v) => !v)}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-accent disabled:opacity-50"
                >
                  {customOpen ? t("emailCard.cancelCustom") : t("emailCard.custom")}
                </button>
              </div>

              {customOpen && (
                <div className="mt-2 w-full max-w-xl rounded-xl border border-border bg-background p-4 text-left">
                  <label className="text-xs font-medium text-muted-foreground">{t("emailCard.customAddress")}</label>
                  <div className="mt-2 flex flex-col items-stretch gap-2 sm:flex-row">
                    <input
                      autoFocus
                      value={customLocal}
                      onChange={(e) => setCustomLocal(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""))}
                      placeholder={t("emailCard.namePlaceholder")}
                      maxLength={32}
                      className="flex-1 rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <span className="hidden items-center px-1 text-muted-foreground sm:flex">@</span>
                    <select
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {domains.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t("emailCard.validationHint")}
                  </p>
                  <button
                    onClick={() => create({ localPart: customLocal, domain: customDomain })}
                    disabled={loading || !validLocal}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-40 sm:w-auto"
                  >
                    {loading ? t("emailCard.creating") : `${t("emailCard.create")} ${customLocal || t("emailCard.namePlaceholder")}@${customDomain}`}
                  </button>
                </div>
              )}
            </div>
          )}
          {error && (
            <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}
        </div>
      </section>

      {/* Inbox */}
      {email && (
        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold">{t("inbox.title")}</h2>
              <span className="text-xs text-muted-foreground">
                {t(inbox.length === 1 ? "inbox.messageOne" : "inbox.messageOther", { count: inbox.length })}
              </span>
            </div>
            <ul className="max-h-[520px] divide-y divide-border overflow-y-auto">
              {inbox.length === 0 && (
                <li className="px-4 py-12 text-center text-sm text-muted-foreground">
                  {t("inbox.waiting")}
                </li>
              )}
              {inbox.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => open(m)}
                    className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition hover:bg-accent ${selected?.id === m.id ? "bg-accent" : ""}`}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className={`truncate text-sm ${m.is_read ? "" : "font-semibold"}`}>{m.from_name || m.from_address}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{new Date(m.received_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <span className="line-clamp-1 text-sm text-muted-foreground">{m.subject}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card">
            {selected ? (
              <article className="flex h-full flex-col">
                <header className="border-b border-border px-5 py-4">
                  <h3 className="text-base font-semibold">{selected.subject}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("inbox.from")} <span className="font-medium text-foreground">{selected.from_name || selected.from_address}</span> · {new Date(selected.received_at).toLocaleString()}
                  </p>
                </header>
                <div className="flex-1 overflow-y-auto p-5">
                  {selected.body_html ? (
                    <iframe
                      title="message"
                      sandbox=""
                      className="h-[480px] w-full rounded-md border border-border bg-background"
                      srcDoc={selected.body_html}
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-sm">{selected.body_text || t("inbox.empty")}</pre>
                  )}
                </div>
              </article>
            ) : (
              <div className="grid h-full min-h-[320px] place-items-center p-8 text-center">
                <p className="text-sm text-muted-foreground">{t("inbox.selectMessage")}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* What is Temporary Email? */}
      <WhatIsTempMail />

      {/* Use Cases */}
      <UseCases />

      {/* FAQ */}
      <FAQ />

      {/* Blog */}
      <BlogPreview />
    </main>
  );
}

/* ---------------- Blog Preview ---------------- */

function BlogPreview() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getBlogPosts()
      .then((p) => {
        if (!cancelled) setPosts(p.slice(0, 6));
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load posts");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return null;
  if (posts && posts.length === 0) return null;

  return (
    <section className="mt-20 sm:mt-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t("blogPreview.eyebrow")}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("blogPreview.title")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {t("blogPreview.subtitle")}
          </p>
        </div>
        <Link
          to="/blog"
          className="hidden shrink-0 text-sm font-medium text-primary hover:underline sm:inline"
        >
          {t("blogPreview.viewAll")}
        </Link>
      </div>

      {!posts ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl border border-border bg-muted/40" />
          ))}
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li
              key={p.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="block">
                {p.cover_image ? (
                  <img
                    src={p.cover_image}
                    alt={p.title}
                    loading="lazy"
                    className="h-44 w-full object-cover transition group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-primary/10 via-card to-primary/5">
                    <Mail className="h-10 w-10 text-primary/60" />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {p.category}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {new Date(p.published_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 text-center sm:hidden">
        <Link to="/blog" className="text-sm font-medium text-primary hover:underline">
          {t("blogPreview.viewAll")}
        </Link>
      </div>
    </section>
  );
}

/* ---------------- What is Temporary Email ---------------- */

function WhatIsTempMail() {
  const { t } = useTranslation();
  const points = [
    { icon: Mail, title: t("whatIs.points.p1Title"), text: t("whatIs.points.p1Text") },
    { icon: EyeOff, title: t("whatIs.points.p2Title"), text: t("whatIs.points.p2Text") },
    { icon: Lock, title: t("whatIs.points.p3Title"), text: t("whatIs.points.p3Text") },
    { icon: Trash2, title: t("whatIs.points.p4Title"), text: t("whatIs.points.p4Text") },
  ];

  return (
    <section className="mt-24">
      <div className="text-center">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {t("whatIs.eyebrow")}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("whatIs.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
          {t("whatIs.subtitle")}
        </p>
      </div>

      <div className="relative mt-12 grid gap-5 sm:grid-cols-2">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 blur-2xl" />
        {points.map((p) => (
          <div
            key={p.title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <p.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold leading-tight">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Use Cases ---------------- */

function UseCases() {
  const { t } = useTranslation();
  const cases = [
    { icon: Download, title: t("useCases.items.downloadsTitle"), text: t("useCases.items.downloadsText"), color: "from-blue-500/15 to-blue-500/5 text-blue-600 dark:text-blue-400" },
    { icon: Clock, title: t("useCases.items.trialsTitle"), text: t("useCases.items.trialsText"), color: "from-violet-500/15 to-violet-500/5 text-violet-600 dark:text-violet-400" },
    { icon: ShoppingBag, title: t("useCases.items.shoppingTitle"), text: t("useCases.items.shoppingText"), color: "from-pink-500/15 to-pink-500/5 text-pink-600 dark:text-pink-400" },
    { icon: Newspaper, title: t("useCases.items.paywallTitle"), text: t("useCases.items.paywallText"), color: "from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400" },
    { icon: Gamepad2, title: t("useCases.items.gameTitle"), text: t("useCases.items.gameText"), color: "from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400" },
    { icon: UserX, title: t("useCases.items.anonTitle"), text: t("useCases.items.anonText"), color: "from-rose-500/15 to-rose-500/5 text-rose-600 dark:text-rose-400" },
    { icon: Briefcase, title: t("useCases.items.testTitle"), text: t("useCases.items.testText"), color: "from-cyan-500/15 to-cyan-500/5 text-cyan-600 dark:text-cyan-400" },
    { icon: ShieldCheck, title: t("useCases.items.breachTitle"), text: t("useCases.items.breachText"), color: "from-indigo-500/15 to-indigo-500/5 text-indigo-600 dark:text-indigo-400" },
  ];

  return (
    <section className="mt-24">
      <div className="text-center">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {t("useCases.eyebrow")}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("useCases.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
          {t("useCases.subtitle")}
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cases.map((c) => (
          <div
            key={c.title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div
              className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.color}`}
            >
              <c.icon className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold leading-tight">{c.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

function FAQ() {
  const { t } = useTranslation();
  const items = [
    { q: t("faq.items.freeQ"), a: t("faq.items.freeA") },
    { q: t("faq.items.lastQ"), a: t("faq.items.lastA") },
    { q: t("faq.items.attachQ"), a: t("faq.items.attachA") },
    { q: t("faq.items.sendQ"), a: t("faq.items.sendA") },
    { q: t("faq.items.regQ"), a: t("faq.items.regA") },
    { q: t("faq.items.safeQ"), a: t("faq.items.safeA") },
    { q: t("faq.items.customQ"), a: t("faq.items.customA") },
    { q: t("faq.items.acceptQ"), a: t("faq.items.acceptA") },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mt-24">
      <div className="text-center">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {t("faq.eyebrow")}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("faq.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
          {t("faq.subtitle")}
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={`overflow-hidden rounded-2xl border bg-card transition ${
                isOpen ? "border-primary/40 shadow-sm" : "border-border"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-accent/40"
                aria-expanded={isOpen}
              >
                <span className="text-base font-medium">{item.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
        <h3 className="text-xl font-semibold">{t("faq.stillTitle")}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {t("faq.stillText")}
        </p>
        <a
          href="/contact"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          {t("faq.contactCta")}
        </a>
      </div>
    </section>
  );
}
