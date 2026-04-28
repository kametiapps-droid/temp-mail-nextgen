## Goal

Cloudflare Worker requests bachao, ek user jitne tabs khole same email/inbox dikhe (refresh/close pe persist), aur user custom local-part + 17 domains me se choose kar sake.

---

## Part 1 — Cloudflare Worker (mytempmail-api) ke 2 naye endpoints

Main `wrangler` ya Cloudflare API se Worker ko khud deploy kar dunga (token mere paas hai).

### 1. `GET /api/domains`

Return karega allowed domains list:
```json
{ "domains": ["mytempmail.pro", "giftofhope.online", "pakconstruction.work", "kameti.online", "khushboo-e-iram.com", "globaljobpoint.com", "closetesting.online", "mytoolhub.store", "playgamesonline.space", "cropimages.store", "onlinetexteditor.website", "calculatoronline.website", "lovecalculator.space", "mycollegenotes.online", "infobox360.com", "malikfaisal.com", "newsbreify.media"] }
```
Domain list ko `ALLOWED_DOMAINS` env var se padhega (comma-separated). Aap baad me Cloudflare dashboard se MX add karke list update kar sakte hain bina code change ke. Default fallback: 17 domains hardcoded.

`POST /api/emails` validation update — sirf `ALLOWED_DOMAINS` me se hi accept kare (security: random domain me email banane se rokna).

### 2. `GET /api/inbox/:emailId/stream` — SSE endpoint

- Connection open hone par turant current inbox bhejega
- Phir har **15 seconds** par Supabase se check karega aur sirf **naye messages** push karega (via `Last-Event-ID` ya server-side cursor)
- Connection 4 minutes baad close — client auto-reconnect (EventSource default)

Resource impact: 1 user × 1 tab = ~4 Worker invocations/min (vs current 3/min polling). Lekin **agar 5 tabs khule, sirf 1 SSE chalegi** thanks to BroadcastChannel leader election (Part 2). Net: Worker requests **kam** honge.

### Fallback
Agar SSE fail ho (corporate proxies), client automatically polling pe gir jaye (30s interval).

---

## Part 2 — Frontend changes

### A. `src/lib/api.ts`
- `getDomains()` function add
- `createEmail({ localPart, domain, turnstileToken })` — domain parameter accept kare
- `subscribeInbox(emailId, onMessage)` — EventSource wrapper

### B. `src/lib/email-store.ts` (NAYA)
Single source of truth for current email + cross-tab sync:
- `localStorage` me `mytempmail.email` aur `mytempmail.inbox` save
- `BroadcastChannel("mytempmail")` events: `email:set`, `email:cleared`, `inbox:update`
- **Leader election**: `localStorage` me `leader-{tabId}` + heartbeat. Sirf leader tab SSE chalata hai. Agar leader tab band ho jaye, doosra tab leader ban jaye (fail-over <2s).
- React hook: `useEmailStore()` returns `{ email, inbox, setEmail, clear }` — sab tabs sync.

### C. `src/routes/index.tsx` rewrite
- Polling code (lines 121-146) hatao → `useEmailStore` hook
- Email card me **3 modes**:
  1. **Empty state**: "Generate" button (random) + "Custom" button
  2. **Custom dialog**: `[input] @ [domain dropdown]` + Captcha + "Create" 
  3. **Active state**: existing UI, no auto-replace on refresh
- "New" button confirmation maange ("Delete current and create new?") — accidental loss rokne ke liye
- Captcha sirf create time pe required, baad me nahi

### D. UI: Modal/Dialog for custom email
Modern minimal: rounded inset card, monospace input, dropdown with grouped domains. Validation: `^[a-z0-9._-]{1,32}$`.

---

## Part 3 — Cross-tab guarantees

| Scenario | Behavior |
|---|---|
| Tab A creates email | Tab B (open) auto-shows same email + inbox |
| New tab opened | Restore from localStorage instantly, no API call |
| Refresh F5 | Same email, inbox restored from localStorage, SSE reconnects |
| Tab A deletes email | Tab B clears too |
| Leader tab closed | Tab B becomes leader in <2s, SSE resumes |
| Email expired | All tabs clear together |

---

## Technical details (for the agent)

**Worker deploy**: I'll fetch current bundle, patch the routes section to add `/api/domains` + `/api/inbox/:id/stream`, redeploy via Cloudflare API multipart upload. Will also add `ALLOWED_DOMAINS` env var with the 17 domains.

**SSE in Worker**: `ReadableStream` + `TransformStream`. Pattern:
```js
const { readable, writable } = new TransformStream();
const writer = writable.getWriter();
ctx.waitUntil((async () => {
  let lastTs = new Date(0).toISOString();
  for (let i = 0; i < 16; i++) { // ~4 min
    const msgs = await db.select("inbox_messages", `?email_id=eq.${id}&received_at=gt.${lastTs}&order=received_at.asc`);
    if (msgs.length) {
      writer.write(new TextEncoder().encode(`data: ${JSON.stringify(msgs)}\n\n`));
      lastTs = msgs[msgs.length-1].received_at;
    }
    await sleep(15000);
  }
  writer.close();
})());
return new Response(readable, { headers: { "Content-Type": "text/event-stream", ...cors }});
```

**Leader election**: Each tab gets random `tabId`. Writes `mytempmail.leader = {id, ts}` every 1s. On read, if leader's `ts` > 3s old, current tab claims leadership (compare-and-swap via storage event race tolerance).

**No new packages needed.** EventSource and BroadcastChannel are browser-native.

---

## What you'll see after this ships

- Open 5 tabs → same email everywhere, only 1 SSE connection to Worker
- Close all tabs, reopen tomorrow → same email back (until 1hr expiry)
- Click "Custom" → type "john.doe" → pick `kameti.online` → get `john.doe@kameti.online`
- Email arrives → appears in all open tabs within ~1s of Worker seeing it

**Note on 17 domains**: Frontend pe sab 17 dikh jayenge, lekin email actually receive sirf un domains pe hoga jinka MX `_email.mx.cloudflare.net` pe point hai aur Cloudflare Email Routing me catch-all rule set hai jo `mytempmail-api`/Worker pe forward kare. Agar koi domain par MX setup nahi hai, address ban jayega lekin emails kabhi nahi aayenge. Recommend: pehle ek domain (mytempmail.pro) pe verify karo end-to-end working, phir baaki ke MX setup karo.