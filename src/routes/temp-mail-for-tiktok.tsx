import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import { Music, ShieldCheck, EyeOff, UserX, Zap, Trash2 } from "lucide-react";

import { seo } from "../lib/seo";

export const Route = createFileRoute("/temp-mail-for-tiktok")({
  head: () => seo({
    path: "/temp-mail-for-tiktok",
    title: "Temp Mail for TikTok — Create Anonymous TikTok Accounts | MyTempMail",
    description: "Use a free temp mail to sign up for TikTok without exposing your real email. Perfect for second accounts, niche profiles, and staying anonymous.",
    keywords: "temp mail for tiktok, tiktok temp email, fake email for tiktok, anonymous tiktok account, disposable email tiktok",
  }),
  component: TikTokTempMailPage,
});

const reasons = [
  { icon: Music, t: "Second / niche accounts", d: "Spin up an extra TikTok profile for a side hustle, niche interest or brand without linking it to your real email." },
  { icon: EyeOff, t: "Anonymous viewing", d: "Create a viewer-only account that isn't tied to your name — keep personal scrolling separate from your main profile." },
  { icon: UserX, t: "Stay private after a breach", d: "If TikTok or a connected app gets breached, your real email never appears in the dump." },
  { icon: Zap, t: "Fast OTP delivery", d: "TikTok's verification code lands in your temp inbox in real time — no need to keep refreshing." },
  { icon: ShieldCheck, t: "Spam-free signup", d: "After verification, the inbox expires — and so do the marketing follow-ups." },
  { icon: Trash2, t: "Clean exit", d: "Done with the account? Delete the temp inbox and the original signup mail goes with it." },
];

function TikTokTempMailPage() {
  return (
    <PageShell
      eyebrow="TikTok"
      title="Temp Mail for TikTok"
      description="Use a free disposable email to sign up for TikTok — perfect for second accounts, niche profiles, and keeping your real inbox out of social-media databases."
    >
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
        <h2 className="text-xl font-semibold">Get a temp email for TikTok</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          One click and you have a working address ready to receive your TikTok verification code.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Generate temp email
        </Link>
      </div>

      <article className="prose prose-neutral mt-12 max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">Why use a temp email for TikTok?</h2>
        <p className="mt-3 leading-relaxed">
          TikTok is one of the most data-hungry signup flows on the modern internet. The address you sign up with becomes the long-term anchor for password resets, login alerts, "we miss you" mail, partner offers, and a constant stream of recommendation digests. If you're creating a second account, an experimental brand profile, or simply want to keep your real inbox out of TikTok's database, a disposable email is the clean fix.
        </p>
        <p className="mt-3 leading-relaxed">
          A temp address works exactly like a real one for the signup itself: TikTok sends a 6-digit verification code, the code arrives instantly in your MyTempMail inbox, you type it back in, and the account is created.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">When this is the right choice</h2>
      </article>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r) => (
          <div key={r.t} className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <r.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">{r.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{r.d}</p>
          </div>
        ))}
      </div>

      <article className="prose prose-neutral mt-12 max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">How to sign up for TikTok with temp mail</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6">
          <li>Click <strong>Generate temp email</strong> above and copy your new disposable address.</li>
          <li>Open the TikTok signup page, choose "Use email" and paste the address.</li>
          <li>Fill in the rest of the form (date of birth, password, username) as usual.</li>
          <li>Watch your MyTempMail inbox — TikTok's 6-digit verification code arrives in seconds.</li>
          <li>Type the code back into TikTok to confirm. You're in.</li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Important caveat</h2>
        <p className="mt-3 leading-relaxed">
          Because the inbox expires, you'll lose the ability to recover the account through email if you ever lose your password. If the TikTok account is meaningful to you (your business, your main creator profile, anything you'd be sad to lose), use your real email and a password manager instead. For burner accounts and short-term experiments, a temp email is exactly the right tool.
        </p>
      </article>
    </PageShell>
  );
}
