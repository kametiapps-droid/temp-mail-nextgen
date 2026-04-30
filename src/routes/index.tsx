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
  Copy,
  Check,
  RefreshCw,
  Inbox as InboxIcon,
  AtSign,
  Wand2,
} from "lucide-react";
import {
  createEmail,
  deleteEmail,
  DEFAULT_DOMAIN,
  getBlogPosts,
  getDomains,
  getInbox,
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

import { seo, SITE_NAME, SITE_URL } from "../lib/seo";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript and a modern browser.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free disposable temporary email — instant inbox with custom name and domain. No signup, no spam.",
};

export const Route = createFileRoute("/")({
  head: () => seo({
    path: "/",
    title: "Free Temporary Email — Instant Disposable Inbox | MyTempMail",
    description: "Generate a free disposable email address instantly. Pick a custom name and domain. No registration. Avoid spam and keep your real inbox clean.",
    keywords: "temp mail, temporary email, disposable email, fake email, throwaway email, anonymous email, free temp mail, instant email",
    jsonLd: homeJsonLd,
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

  // Manual inbox refresh + auto countdown indicator
  const REFRESH_INTERVAL = 15; // seconds
  const [refreshing, setRefreshing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(REFRESH_INTERVAL);
  const [lastRefreshed, setLastRefreshed] = useState<number>(() => Date.now());

  const refreshInbox = useCallback(async () => {
    if (!email) return;
    setRefreshing(true);
    try {
      const msgs = await getInbox(email.id);
      applyIncoming(msgs);
      setLastRefreshed(Date.now());
      setSecondsLeft(REFRESH_INTERVAL);
    } catch {
      /* ignore */
    } finally {
      setTimeout(() => setRefreshing(false), 400);
    }
  }, [email]);

  // Reset countdown whenever email changes or new messages arrive
  useEffect(() => {
    setSecondsLeft(REFRESH_INTERVAL);
    setLastRefreshed(Date.now());
  }, [email?.id, inbox.length]);

  // Tick every second; auto-refresh when reaching 0
  useEffect(() => {
    if (!email) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          refreshInbox();
          return REFRESH_INTERVAL;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [email, refreshInbox]);

  const validLocal = /^[a-z0-9._-]{1,32}$/.test(customLocal.toLowerCase());

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:pt-14">
      {/* Hero + Email Generator combined */}
      <section className="relative">
        {/* Animated background blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[36px]">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-grid-fade opacity-60" />
          <div className="animate-blob absolute -left-16 top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="animate-blob absolute -right-10 top-32 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl [animation-delay:-4s]" />
          <div className="animate-blob absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl [animation-delay:-8s]" />
        </div>

        <div className="px-2 pb-2 pt-10 text-center sm:pt-16">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {t("hero.badge")}
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            <span className="text-gradient-primary">{t("hero.title")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Email card */}
        <div className="relative mx-auto mt-8 max-w-3xl px-1 sm:mt-12">
          {/* Floating mail icon */}
          {!email && (
            <div
              aria-hidden
              className="animate-float pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded-2xl bg-gradient-primary p-4 shadow-glow"
            >
              <Mail className="h-7 w-7 text-primary-foreground" />
            </div>
          )}

          {/* Outer glow ring */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-[28px] bg-gradient-to-r from-primary/40 via-fuchsia-500/30 to-cyan-500/40 opacity-60 blur-[2px]"
          />

          <div className="relative overflow-hidden rounded-[26px] border border-border/60 bg-card/90 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            {/* Top status bar */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-destructive/70" />
                <span className="flex h-2 w-2 rounded-full bg-amber-400/80" />
                <span className="flex h-2 w-2 rounded-full bg-success/80" />
                <span className="ml-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {email ? t("emailCard.yourEmail", { defaultValue: "Your inbox" }) : t("emailCard.generateNew", { defaultValue: "New address" })}
                </span>
              </div>
              {email && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
                  {t("emailCard.liveInbox")}
                </span>
              )}
            </div>

            {email ? (
              <>
                {/* Email address pill */}
                <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-fuchsia-500/5 p-1">
                  <div className="flex flex-col items-stretch gap-2 rounded-xl bg-background/50 p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                        <AtSign className="h-5 w-5" />
                      </span>
                      <p className="truncate font-mono text-base font-semibold tracking-tight sm:text-xl">
                        {email.email_address}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={copy}
                        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-[0.97] sm:flex-initial ${
                          copied
                            ? "bg-success text-primary-foreground"
                            : "bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-lg"
                        }`}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? t("emailCard.copied") : t("emailCard.copy")}</span>
                      </button>
                      <button
                        onClick={remove}
                        title={t("emailCard.delete")}
                        className="inline-flex items-center justify-center rounded-xl border border-border bg-background/70 px-3.5 py-3 transition hover:border-destructive/40 hover:bg-destructive hover:text-destructive-foreground active:scale-[0.97]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="rounded-xl border border-border/60 bg-background/50 p-3 text-center backdrop-blur">
                    <Clock className="mx-auto mb-1 h-4 w-4 text-primary" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("emailCard.expiresIn")}</p>
                    <p className="mt-0.5 text-sm font-bold tabular-nums">{expiresIn}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/50 p-3 text-center backdrop-blur">
                    <InboxIcon className="mx-auto mb-1 h-4 w-4 text-primary" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Messages</p>
                    <p className="mt-0.5 text-sm font-bold tabular-nums">{inbox.length}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/50 p-3 text-center backdrop-blur">
                    <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-success" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</p>
                    <p className="mt-0.5 text-sm font-bold text-success">Active</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-5 py-6 text-center">
                <p className="max-w-md text-sm text-muted-foreground sm:text-base">{t("emailCard.noEmail")}</p>
                {TURNSTILE_SITE_KEY && <div ref={tsRef} />}
                <div className="flex w-full flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
                  <button
                    onClick={() => create({})}
                    disabled={loading}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-glow transition hover:shadow-2xl active:scale-[0.97] disabled:opacity-50"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <Sparkles className="h-4 w-4" />
                    {loading ? t("emailCard.generating") : t("emailCard.generate")}
                  </button>
                  <button
                    onClick={() => setCustomOpen((v) => !v)}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background/70 px-6 py-4 text-sm font-medium backdrop-blur transition hover:border-primary/40 hover:bg-accent active:scale-[0.97] disabled:opacity-50"
                  >
                    <Wand2 className="h-4 w-4" />
                    {customOpen ? t("emailCard.cancelCustom") : t("emailCard.custom")}
                  </button>
                </div>

                {customOpen && (
                  <div className="mt-2 w-full max-w-xl rounded-2xl border border-border bg-background/80 p-4 text-left backdrop-blur">
                    <label className="text-xs font-medium text-muted-foreground">{t("emailCard.customAddress")}</label>
                    <div className="mt-2 flex flex-col items-stretch gap-2 sm:flex-row">
                      <input
                        autoFocus
                        value={customLocal}
                        onChange={(e) => setCustomLocal(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""))}
                        placeholder={t("emailCard.namePlaceholder")}
                        maxLength={32}
                        className="flex-1 rounded-xl border border-border bg-card px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <span className="hidden items-center px-1 text-muted-foreground sm:flex">@</span>
                      <select
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        className="rounded-xl border border-border bg-card px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-40 sm:w-auto"
                    >
                      {loading ? t("emailCard.creating") : `${t("emailCard.create")} ${customLocal || t("emailCard.namePlaceholder")}@${customDomain}`}
                    </button>
                  </div>
                )}

                {/* Trust badges */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-success" /> No signup</span>
                  <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-primary" /> Anonymous</span>
                  <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Instant</span>
                </div>
              </div>
            )}
            {error && (
              <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>
      </section>

      {/* Inbox */}
      {email && (
        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-border bg-gradient-mail px-4 py-3">
              <div className="flex items-center gap-2">
                <InboxIcon className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold">{t("inbox.title")}</h2>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {inbox.length}
                </span>
              </div>
              <button
                onClick={refreshInbox}
                disabled={refreshing}
                title={t("inbox.refresh", { defaultValue: "Refresh" })}
                className="group relative inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium backdrop-blur transition hover:bg-accent disabled:opacity-60"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-primary ${refreshing ? "animate-spin-slow" : ""}`} />
                <span className="tabular-nums">
                  {refreshing
                    ? t("inbox.refreshing", { defaultValue: "Refreshing…" })
                    : `${secondsLeft}s`}
                </span>
                {/* Countdown progress ring */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(color-mix(in oklab, var(--primary) 35%, transparent) ${
                      ((REFRESH_INTERVAL - secondsLeft) / REFRESH_INTERVAL) * 360
                    }deg, transparent 0deg)`,
                    mask: "radial-gradient(circle, transparent 64%, black 65%)",
                    WebkitMask: "radial-gradient(circle, transparent 64%, black 65%)",
                  }}
                />
              </button>
            </div>
            <ul className="max-h-[520px] divide-y divide-border overflow-y-auto">
              {inbox.length === 0 && (
                <li className="px-4 py-12 text-center text-sm text-muted-foreground">
                  <InboxIcon className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                  {t("inbox.waiting")}
                </li>
              )}
              {inbox.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => open(m)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-accent ${selected?.id === m.id ? "bg-accent" : ""}`}
                  >
                    <span
                      className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold uppercase ${
                        m.is_read ? "bg-muted text-muted-foreground" : "bg-gradient-primary text-primary-foreground shadow-glow"
                      }`}
                    >
                      {(m.from_name || m.from_address).slice(0, 2)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className={`truncate text-sm ${m.is_read ? "" : "font-semibold"}`}>{m.from_name || m.from_address}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{new Date(m.received_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <span className="mt-0.5 line-clamp-1 block text-sm text-muted-foreground">{m.subject}</span>
                    </div>
                    {!m.is_read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-border bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
              {t("inbox.lastUpdated", { defaultValue: "Last updated" })}:{" "}
              <span className="font-medium text-foreground">
                {new Date(lastRefreshed).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {selected ? (
              <article className="flex h-full flex-col">
                <header className="border-b border-border bg-gradient-mail px-5 py-4">
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
                <div>
                  <Mail className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">{t("inbox.selectMessage")}</p>
                </div>
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
