// API client for the Cloudflare Worker (mytempmail-api)
// Worker URL is set via VITE_API_URL on Vercel; falls back to public worker URL.

export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "https://mytempmail-api.kametiapps.workers.dev";

export const DEFAULT_DOMAIN =
  (import.meta.env.VITE_TEMPMAIL_DOMAIN as string | undefined) || "mytempmail.pro";

export const TURNSTILE_SITE_KEY =
  (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ||
  "0x4AAAAAADBQjYymjLJ35UGX";

export interface TempEmail {
  id: string;
  email_address: string;
  domain: string;
  expires_at: string;
}

export interface InboxMessage {
  id: string;
  from_address: string;
  from_name: string | null;
  subject: string;
  body_text: string | null;
  body_html: string | null;
  received_at: string;
  is_read: boolean;
}

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    const err = new Error(msg) as Error & { status?: number; code?: string };
    err.status = res.status;
    if (data?.code) err.code = data.code;
    throw err;
  }
  return data as T;
}

export function randomLocalPart(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function getDomains(): Promise<string[]> {
  const r = await http<{ domains: string[] }>("/domains");
  return r.domains;
}

export async function createEmail(opts: {
  localPart?: string;
  domain?: string;
  turnstileToken?: string;
}): Promise<TempEmail> {
  const local = (opts.localPart || randomLocalPart()).toLowerCase();
  const domain = (opts.domain || DEFAULT_DOMAIN).toLowerCase();
  const email_address = `${local}@${domain}`;
  const headers: Record<string, string> = {};
  if (opts.turnstileToken) headers["x-turnstile-token"] = opts.turnstileToken;
  return http<TempEmail>("/emails", {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address, domain }),
  });
}

export async function getInbox(emailId: string): Promise<InboxMessage[]> {
  return http<InboxMessage[]>(`/inbox/${emailId}`);
}

export async function markRead(messageId: string): Promise<void> {
  await http(`/inbox/messages/${messageId}/read`, { method: "PATCH" });
}

export async function deleteEmail(emailId: string): Promise<void> {
  await http(`/emails/${emailId}`, { method: "DELETE" });
}

export async function getExpiry(emailId: string): Promise<{ expires_at: string }> {
  return http(`/emails/${emailId}/expiry`);
}

// SSE inbox stream — returns a closer function
export function subscribeInbox(
  emailId: string,
  opts: {
    since?: string;
    onMessages: (msgs: InboxMessage[]) => void;
    onError?: (err: Event) => void;
  }
): () => void {
  let es: EventSource | null = null;
  let closed = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  const open = () => {
    if (closed) return;
    const url = new URL(`${API_URL}/api/inbox/${emailId}/stream`);
    if (opts.since) url.searchParams.set("since", opts.since);
    es = new EventSource(url.toString());
    es.addEventListener("messages", (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data) as InboxMessage[];
        opts.onMessages(data);
      } catch {}
    });
    es.addEventListener("close", () => {
      es?.close();
      es = null;
      // worker closed at max duration — reconnect immediately
      if (!closed) reconnectTimer = setTimeout(open, 500);
    });
    es.onerror = (e) => {
      opts.onError?.(e);
      es?.close();
      es = null;
      if (!closed) reconnectTimer = setTimeout(open, 3000);
    };
  };

  open();

  return () => {
    closed = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    es?.close();
  };
}

// Blog
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  cover_image: string | null;
  published_at: string;
}
export async function getBlogPosts(): Promise<BlogPost[]> {
  return http<BlogPost[]>("/blog");
}
export async function getBlogPost(slug: string): Promise<BlogPost> {
  return http<BlogPost>(`/blog/${slug}`);
}
export async function getRelatedPosts(slug: string): Promise<BlogPost[]> {
  return http<BlogPost[]>(`/blog/${slug}/related`);
}
