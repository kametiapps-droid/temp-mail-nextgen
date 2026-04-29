import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import { ShieldCheck, KeyRound, Mail, CheckCircle2, Clock, EyeOff } from "lucide-react";

import { seo } from "../lib/seo";

export const Route = createFileRoute("/disposable-email-for-verification")({
  head: () => seo({
    path: "/disposable-email-for-verification",
    title: "Disposable Email for Verification — Receive OTP & Confirmation Codes | MyTempMail",
    description: "Use a disposable email to receive verification codes, confirmation links, and OTPs without giving away your real address. Free, instant, no signup.",
    keywords: "disposable email for verification, temp email for verification, email verification, OTP verification, confirmation email, throwaway email",
  }),
  component: VerificationPage,
});

const benefits = [
  { icon: KeyRound, t: "Receives codes & OTPs", d: "Numeric codes, magic links, confirmation tokens — they all land in your inbox in seconds." },
  { icon: Clock, t: "Real-time delivery", d: "No need to refresh — verification mail appears the instant the sender hits send." },
  { icon: EyeOff, t: "No personal trail", d: "The site you're verifying with never sees your real email, name, or any other identifier." },
  { icon: CheckCircle2, t: "Works with most services", d: "Compatible with the vast majority of websites that ask for an email confirmation." },
  { icon: ShieldCheck, t: "Auto-deletes", d: "Once verified, walk away — the inbox and the verification email vanish on schedule." },
  { icon: Mail, t: "Custom names supported", d: "Pick a memorable address if the verification flow shows it back to you." },
];

function VerificationPage() {
  return (
    <PageShell
      eyebrow="Verification"
      title="Disposable Email for Verification"
      description="Receive verification codes, magic links, and confirmation emails without ever exposing your real address. Built for one-time signups, not lifelong inboxes."
    >
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
        <h2 className="text-xl font-semibold">Get a verification inbox now</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          One click and you have a working address ready to receive a code or confirmation link.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Generate verification email
        </Link>
      </div>

      <article className="prose prose-neutral mt-12 max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">When to use a disposable email for verification</h2>
        <p className="mt-3 leading-relaxed">
          A huge number of websites only ask for your email so they can send a one-time confirmation link or a verification code. Once you click the link or type the code, the relationship is over — but the address you used stays in their database forever, ready to be marketed to or leaked. A disposable email for verification breaks that loop. You receive the code, you use it, and the inbox disappears.
        </p>
        <p className="mt-3 leading-relaxed">
          It's a perfect fit for free trials, ebook downloads, paywalled article unlocks, forum signups, beta tests, giveaways, public Wi-Fi captive portals, and any verification flow where you don't actually want a long-term account.
        </p>
      </article>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b) => (
          <div key={b.t} className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <b.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">{b.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
          </div>
        ))}
      </div>

      <article className="prose prose-neutral mt-12 max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6">
          <li>Click <strong>Generate verification email</strong> to spin up a fresh inbox.</li>
          <li>Copy the address and paste it into the signup or verification field on the site you're using.</li>
          <li>The site sends its confirmation link or OTP — it appears in your inbox in real time.</li>
          <li>Click the link or copy the code, complete the verification, and you're done.</li>
          <li>Delete the inbox or let it expire — either way, no lasting trace.</li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">When <em>not</em> to use a disposable verification email</h2>
        <p className="mt-3 leading-relaxed">
          Disposable verification is the wrong choice when you actually want to keep the account long-term. Don't use it for banks, government portals, healthcare, your work tools, or anything that holds money or identity documents — once the inbox expires, you'll lose the only path to recovering that account. For every other casual signup, it's the cleanest option there is.
        </p>
      </article>
    </PageShell>
  );
}
