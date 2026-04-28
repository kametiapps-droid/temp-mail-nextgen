// Cross-tab email + inbox store.
// - Persists current email & inbox in localStorage so refresh/new tabs restore instantly
// - Broadcasts changes to other tabs via BroadcastChannel
// - Leader election so only ONE tab opens the SSE stream to the Worker
//   (saves Cloudflare requests when the user has many tabs open)

import { useEffect, useRef, useSyncExternalStore } from "react";
import { subscribeInbox, type InboxMessage, type TempEmail } from "./api";

const EMAIL_KEY = "mytempmail.email";
const INBOX_KEY = "mytempmail.inbox";
const LEADER_KEY = "mytempmail.leader";
const HEARTBEAT_MS = 1000;
const LEADER_STALE_MS = 3000;

type State = {
  email: TempEmail | null;
  inbox: InboxMessage[];
};

const isBrowser = typeof window !== "undefined";

function readEmail(): TempEmail | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(EMAIL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TempEmail;
    if (parsed?.expires_at && new Date(parsed.expires_at) <= new Date()) {
      localStorage.removeItem(EMAIL_KEY);
      localStorage.removeItem(INBOX_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function readInbox(): InboxMessage[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(INBOX_KEY);
    return raw ? (JSON.parse(raw) as InboxMessage[]) : [];
  } catch {
    return [];
  }
}

let state: State = isBrowser
  ? { email: readEmail(), inbox: readInbox() }
  : { email: null, inbox: [] };

const listeners = new Set<() => void>();
function notify() {
  for (const l of listeners) l();
}

let channel: BroadcastChannel | null = null;
if (isBrowser && "BroadcastChannel" in window) {
  channel = new BroadcastChannel("mytempmail");
  channel.onmessage = (e) => {
    const { type, payload } = e.data || {};
    if (type === "email:set") {
      state = { email: payload as TempEmail, inbox: [] };
      notify();
    } else if (type === "email:clear") {
      state = { email: null, inbox: [] };
      notify();
    } else if (type === "inbox:set") {
      state = { ...state, inbox: payload as InboxMessage[] };
      notify();
    } else if (type === "inbox:read") {
      const id = payload as string;
      state = {
        ...state,
        inbox: state.inbox.map((m) => (m.id === id ? { ...m, is_read: true } : m)),
      };
      notify();
    }
  };
}

// React to other tabs writing localStorage directly (e.g. private mode without BC)
if (isBrowser) {
  window.addEventListener("storage", (e) => {
    if (e.key === EMAIL_KEY) {
      state = { email: readEmail(), inbox: readInbox() };
      notify();
    } else if (e.key === INBOX_KEY) {
      state = { ...state, inbox: readInbox() };
      notify();
    }
  });
}

function persistEmail(email: TempEmail | null) {
  if (!isBrowser) return;
  if (email) localStorage.setItem(EMAIL_KEY, JSON.stringify(email));
  else {
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(INBOX_KEY);
  }
}
function persistInbox(inbox: InboxMessage[]) {
  if (!isBrowser) return;
  localStorage.setItem(INBOX_KEY, JSON.stringify(inbox));
}

export function setEmail(email: TempEmail) {
  state = { email, inbox: [] };
  persistEmail(email);
  persistInbox([]);
  channel?.postMessage({ type: "email:set", payload: email });
  notify();
}

export function clearEmail() {
  state = { email: null, inbox: [] };
  persistEmail(null);
  channel?.postMessage({ type: "email:clear" });
  notify();
}

function mergeInbox(prev: InboxMessage[], incoming: InboxMessage[]): InboxMessage[] {
  if (!incoming.length) return prev;
  const map = new Map<string, InboxMessage>();
  for (const m of prev) map.set(m.id, m);
  for (const m of incoming) {
    const ex = map.get(m.id);
    map.set(m.id, ex ? { ...ex, ...m } : m);
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime()
  );
}

export function applyIncoming(messages: InboxMessage[]) {
  const merged = mergeInbox(state.inbox, messages);
  state = { ...state, inbox: merged };
  persistInbox(merged);
  channel?.postMessage({ type: "inbox:set", payload: merged });
  notify();
}

export function markMessageRead(id: string) {
  state = {
    ...state,
    inbox: state.inbox.map((m) => (m.id === id ? { ...m, is_read: true } : m)),
  };
  persistInbox(state.inbox);
  channel?.postMessage({ type: "inbox:read", payload: id });
  notify();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const getSnapshot = () => state;
const getServerSnapshot = (): State => ({ email: null, inbox: [] });

export function useEmailStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Leader election: only one tab keeps the SSE stream open per email.
// We write {tabId, ts} to localStorage every HEARTBEAT_MS. If the leader
// hasn't beaten in LEADER_STALE_MS, any tab can claim leadership.
function makeTabId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useInboxStream() {
  const { email } = useEmailStore();
  const tabIdRef = useRef<string>("");
  if (!tabIdRef.current) tabIdRef.current = makeTabId();

  useEffect(() => {
    if (!isBrowser || !email) return;
    const tabId = tabIdRef.current;
    let isLeader = false;
    let unsubscribe: (() => void) | null = null;
    let heartbeat: ReturnType<typeof setInterval> | null = null;

    const readLeader = (): { id: string; ts: number; emailId: string } | null => {
      try {
        const raw = localStorage.getItem(LEADER_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    };
    const writeLeader = () => {
      localStorage.setItem(
        LEADER_KEY,
        JSON.stringify({ id: tabId, ts: Date.now(), emailId: email.id })
      );
    };

    const startStream = () => {
      if (unsubscribe) return;
      const since =
        state.inbox.length > 0
          ? state.inbox[0].received_at // newest first
          : undefined;
      unsubscribe = subscribeInbox(email.id, {
        since,
        onMessages: (msgs) => applyIncoming(msgs),
      });
    };
    const stopStream = () => {
      unsubscribe?.();
      unsubscribe = null;
    };

    const tick = () => {
      const cur = readLeader();
      const now = Date.now();
      const stale = !cur || now - cur.ts > LEADER_STALE_MS || cur.emailId !== email.id;
      if (isLeader) {
        if (stale || cur?.id === tabId) {
          writeLeader();
        } else {
          // someone else became leader — yield
          isLeader = false;
          stopStream();
        }
      } else if (stale) {
        // claim leadership (best-effort; storage event resolves rare races)
        writeLeader();
        // re-check after a beat to confirm we still own it
        setTimeout(() => {
          const after = readLeader();
          if (after?.id === tabId) {
            isLeader = true;
            startStream();
          }
        }, 100);
      }
    };

    tick();
    heartbeat = setInterval(tick, HEARTBEAT_MS);

    const onUnload = () => {
      const cur = readLeader();
      if (cur?.id === tabId) localStorage.removeItem(LEADER_KEY);
      stopStream();
    };
    window.addEventListener("beforeunload", onUnload);

    return () => {
      if (heartbeat) clearInterval(heartbeat);
      window.removeEventListener("beforeunload", onUnload);
      const cur = readLeader();
      if (cur?.id === tabId) localStorage.removeItem(LEADER_KEY);
      stopStream();
    };
  }, [email?.id]);
}
