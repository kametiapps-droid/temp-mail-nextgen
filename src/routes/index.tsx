import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createEmail,
  deleteEmail,
  getInbox,
  markRead,
  TURNSTILE_SITE_KEY,
  type InboxMessage,
  type TempEmail,
} from "../lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Free Temporary Email — Instant Disposable Inbox | MyTempMail" },
      { name: "description", content: "Generate a free disposable email address instantly. No registration. Avoid spam and keep your real inbox clean." },
      { property: "og:title", content: "MyTempMail — Free Disposable Temporary Email" },
      { property: "og:description", content: "Instant disposable email. No signup. Free forever." },
    ],
  }),
  component: HomePage,
});

const STORAGE_KEY = "mytempmail.email";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "error-callback"?: () => void }) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
      execute?: (id: string) => void;
    };
  }
}

function useTurnstileToken(): { token: string | null; ref: React.RefObject<HTMLDivElement | null>; reset: () => void } {
  const ref = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
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
    return () => clearInterval(tick);
  }, []);

  const reset = useCallback(() => {
    setToken(null);
    if (window.turnstile && widgetId.current) window.turnstile.reset(widgetId.current);
  }, []);

  return { token, ref, reset };
}

function HomePage() {
  const [email, setEmail] = useState<TempEmail | null>(null);
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [selected, setSelected] = useState<InboxMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { token: tsToken, ref: tsRef, reset: tsReset } = useTurnstileToken();

  // restore from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as TempEmail;
      if (parsed && new Date(parsed.expires_at) > new Date()) setEmail(parsed);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (TURNSTILE_SITE_KEY && !tsToken) {
        setError("Please complete the captcha first.");
        setLoading(false);
        return;
      }
      const e = await createEmail({ turnstileToken: tsToken || undefined });
      setEmail(e);
      setMessages([]);
      setSelected(null);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(e));
      tsReset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  }, [tsToken, tsReset]);

  // poll inbox: 20s when visible, paused when hidden — saves Worker requests
  useEffect(() => {
    if (!email) return;
    let stopped = false;
    let timer: ReturnType<typeof setInterval> | null = null;
    const fetchInbox = async () => {
      if (document.hidden) return;
      try {
        const m = await getInbox(email.id);
        if (!stopped) setMessages(m);
      } catch {}
    };
    const start = () => {
      if (timer) return;
      fetchInbox();
      timer = setInterval(fetchInbox, 20000);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const onVis = () => { document.hidden ? stop() : start(); };
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stopped = true;
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [email]);

  const copy = useCallback(async () => {
    if (!email) return;
    await navigator.clipboard.writeText(email.email_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [email]);

  const remove = useCallback(async () => {
    if (!email) return;
    try { await deleteEmail(email.id); } catch {}
    localStorage.removeItem(STORAGE_KEY);
    setEmail(null);
    setMessages([]);
    setSelected(null);
  }, [email]);

  const open = useCallback(async (msg: InboxMessage) => {
    setSelected(msg);
    if (!msg.is_read) {
      try {
        await markRead(msg.id);
        setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: true } : m));
      } catch {}
    }
  }, []);

  const expiresIn = useMemo(() => {
    if (!email) return null;
    const ms = new Date(email.expires_at).getTime() - Date.now();
    if (ms <= 0) return "expired";
    const min = Math.floor(ms / 60000);
    return `${min} min`;
  }, [email]);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-12 sm:pt-20">
      {/* Hero */}
      <section className="text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> No signup · No spam · Free
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Disposable email,<br className="hidden sm:block" /> in one click.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Generate a free temporary email address. Receive messages instantly. Protect your real inbox from spam.
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
                <div className="flex gap-2">
                  <button
                    onClick={copy}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={generate}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-accent disabled:opacity-50"
                  >
                    New
                  </button>
                  <button
                    onClick={remove}
                    aria-label="Delete"
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-3 py-3 text-sm hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2m-9 0v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6"/></svg>
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Expires in <span className="font-medium text-foreground">{expiresIn}</span>. Inbox refreshes every 20 seconds.
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">No email yet.</p>
              {TURNSTILE_SITE_KEY && <div ref={tsRef} />}
              <button
                onClick={generate}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Generating…" : "Generate temporary email"}
              </button>
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
              <h2 className="text-sm font-semibold">Inbox</h2>
              <span className="text-xs text-muted-foreground">{messages.length} message{messages.length !== 1 ? "s" : ""}</span>
            </div>
            <ul className="max-h-[520px] divide-y divide-border overflow-y-auto">
              {messages.length === 0 && (
                <li className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Waiting for messages…
                </li>
              )}
              {messages.map((m) => (
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
                    From <span className="font-medium text-foreground">{selected.from_name || selected.from_address}</span> · {new Date(selected.received_at).toLocaleString()}
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
                    <pre className="whitespace-pre-wrap font-sans text-sm">{selected.body_text || "(empty)"}</pre>
                  )}
                </div>
              </article>
            ) : (
              <div className="grid h-full min-h-[320px] place-items-center p-8 text-center">
                <p className="text-sm text-muted-foreground">Select a message to read it.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trust strip */}
      <section className="mt-20 grid gap-6 sm:grid-cols-3">
        {[
          { t: "No signup", d: "Get an inbox in under a second. No accounts, no passwords." },
          { t: "Auto-expire", d: "Addresses self-destruct so your data doesn't linger." },
          { t: "Spam shield", d: "Use it for forms, downloads, trials — keep your real email private." },
        ].map((f) => (
          <div key={f.t} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-base font-semibold">{f.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
