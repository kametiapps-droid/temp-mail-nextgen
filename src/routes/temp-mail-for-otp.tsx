import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import { KeyRound, Zap, ShieldCheck, Smartphone, Clock, EyeOff } from "lucide-react";

export const Route = createFileRoute("/temp-mail-for-otp")({
  head: () => ({
    meta: [
      { title: "Temp Mail for OTP — Receive One-Time Passwords Instantly | MyTempMail" },
      { name: "description", content: "Get a free temp mail to receive OTPs and one-time verification codes in real time. No signup, no spam — perfect for any account that asks for an email OTP." },
      { name: "keywords", content: "temp mail for otp, temp email otp, otp email, one time password email, disposable email otp, fake email for otp" },
      { property: "og:title", content: "Temp Mail for OTP — MyTempMail" },
      { property: "og:description", content: "Receive one-time passwords on a free disposable inbox — instant, no signup." },
    ],
  }),
  component: OTPPage,
});

const benefits = [
  { icon: Zap, t: "Instant OTP delivery", d: "Codes appear in your inbox in real time — no refresh, no waiting, no missed timers." },
  { icon: KeyRound, t: "Works with any OTP", d: "Numeric codes, 6-digit PINs, magic links, alphanumeric tokens — all delivered the same way." },
  { icon: Clock, t: "Beat the expiry timer", d: "Most OTPs expire in 5–10 minutes. With instant delivery you've always got plenty of time." },
  { icon: EyeOff, t: "Your real number stays hidden", d: "Email-based OTPs let you sign up to services without handing over your phone number." },
  { icon: ShieldCheck, t: "Spam-free", d: "Once the OTP is used, the inbox expires — no \"thanks for verifying\" newsletters either." },
  { icon: Smartphone, t: "Works on phone & desktop", d: "Open the OTP inbox on the same device, or copy the code from another tab — both work." },
];

function OTPPage() {
  return (
    <PageShell
      eyebrow="OTP"
      title="Temp Mail for OTP"
      description="Receive one-time passwords and verification codes on a free disposable inbox — instantly, anonymously, and with zero spam afterwards."
    >
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
        <h2 className="text-xl font-semibold">Get a temp inbox for OTP now</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          One click and you have an inbox ready to receive your one-time password.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Generate OTP inbox
        </Link>
      </div>

      <article className="prose prose-neutral mt-12 max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">Why use temp mail for OTPs?</h2>
        <p className="mt-3 leading-relaxed">
          A one-time password (OTP) is a single-use code a service sends you to confirm you really are who you say you are. They're sent to your email or phone, they expire in a few minutes, and the moment you've used one, it's worthless. The address you receive it on, however, is not — it stays in the sender's database forever, ready to be marketed to or leaked. A temp mail for OTP gives you the security benefit of email-based verification without the long-term cost.
        </p>
        <p className="mt-3 leading-relaxed">
          It's a perfect match for free trials, account signups, free downloads, beta tests, public Wi-Fi captive portals, and any flow where the only reason a site wants your email is to send you a one-time code.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">What you get</h2>
      </article>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        <h2 className="text-2xl font-semibold tracking-tight">How to receive an OTP on temp mail</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6">
          <li>Click <strong>Generate OTP inbox</strong> to create a fresh disposable address.</li>
          <li>Copy the address and paste it into the signup or verification field.</li>
          <li>Trigger the OTP email (usually by clicking "Send code" or "Continue").</li>
          <li>The code arrives in your inbox in real time — copy it.</li>
          <li>Paste the OTP back into the site to complete verification. Done.</li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Important note</h2>
        <p className="mt-3 leading-relaxed">
          Once your inbox expires, any account you secured with that OTP becomes harder (or impossible) to recover. Use temp OTP inboxes only for accounts you don't need long-term — for anything you actually care about, use your real email and a password manager.
        </p>
      </article>
    </PageShell>
  );
}
