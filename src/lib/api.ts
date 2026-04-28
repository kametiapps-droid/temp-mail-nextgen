// API client for the Cloudflare Worker (mytempmail-api)
// Worker URL is set via VITE_API_URL on Vercel; falls back to public worker URL.

export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "https://mytempmail-api.kametiapps.workers.dev";

export const TEMPMAIL_DOMAIN =
  (import.meta.env.VITE_TEMPMAIL_DOMAIN as string | undefined) || "mytempmail.pro";

export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as
  | string
  | undefined;

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
    throw new Error(msg);
  }
  return data as T;
}

function randomLocalPart(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function createEmail(opts?: {
  localPart?: string;
  turnstileToken?: string;
}): Promise<TempEmail> {
  const local = (opts?.localPart || randomLocalPart()).toLowerCase();
  const email_address = `${local}@${TEMPMAIL_DOMAIN}`;
  const headers: Record<string, string> = {};
  if (opts?.turnstileToken) headers["x-turnstile-token"] = opts.turnstileToken;
  return http<TempEmail>("/emails", {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address, domain: TEMPMAIL_DOMAIN }),
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
