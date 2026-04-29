import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import { Tv, Clock, ShieldCheck, EyeOff, Zap, Trash2 } from "lucide-react";

import { seo } from "../lib/seo";

export const Route = createFileRoute("/temp-mail-for-netflix")({
  head: () => seo({
    path: "/temp-mail-for-netflix",
    title: "Temp Mail for Netflix — Sign Up & Try Free Trials Anonymously | MyTempMail",
    description: "Use a free temp mail to sign up for Netflix without giving away your real email. Perfect for free trials, demo accounts and avoiding promo spam.",
    keywords: "temp mail for netflix, netflix temp email, fake email for netflix, netflix free trial email, disposable email netflix",
  }),
  component: NetflixTempMailPage,
});

const reasons = [
  { icon: Tv, t: "Try free trials & previews", d: "Sample Netflix or a partner promo without ending up on their lifetime renewal mailing list." },
  { icon: Clock, t: "Skip cancellation reminders", d: "No \"your trial is ending\" or \"we miss you\" mail in your real inbox six months after you cancelled." },
  { icon: EyeOff, t: "Keep streaming habits private", d: "Watch history emails, recommendations and account alerts stay in a throwaway inbox, not on your work account." },
  { icon: Zap, t: "Instant verification", d: "The Netflix confirmation code lands in your temp inbox in seconds — no need to refresh." },
  { icon: ShieldCheck, t: "Spam-free signup", d: "After verification, the inbox expires and the marketing chain dies with it." },
  { icon: Trash2, t: "Clean exit", d: "Done with the account? Delete the temp inbox — the original signup mail goes with it." },
];

function NetflixTempMailPage() {
  return (
    <PageShell
      eyebrow="Netflix"
      title="Temp Mail for Netflix"
      description="Use a free disposable email to sign up for Netflix — perfect for free trials, demo accounts, and keeping your real inbox out of streaming-service databases."
    >
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
        <h2 className="text-xl font-semibold">Get a temp email for Netflix</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          One click and you have a working address ready to receive your Netflix verification email.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Generate temp email
        </Link>
      </div>

      <article className="prose prose-neutral mt-12 max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">Why use a temp email for Netflix?</h2>
        <p className="mt-3 leading-relaxed">
          Streaming services love an email address. Once you sign up, that inbox becomes the long-term anchor for billing reminders, "you might also like" suggestions, partner promos, win-back offers, and quiet little notes whenever someone logs in from a new device. If you only want to try Netflix for a free preview, sample a regional library, or set up a temporary household profile, a disposable email lets you do exactly that without volunteering your real address for years of marketing follow-up.
        </p>
        <p className="mt-3 leading-relaxed">
          The signup itself works exactly like any other: Netflix sends a confirmation email, the email arrives in your MyTempMail inbox in real time, you click the link, and you're in.
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
        <h2 className="text-2xl font-semibold tracking-tight">How to sign up for Netflix with temp mail</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6">
          <li>Click <strong>Generate temp email</strong> above and copy your new disposable address.</li>
          <li>Open the Netflix signup page and paste the address into the email field.</li>
          <li>Choose a plan and complete the rest of the signup form as usual.</li>
          <li>Watch your MyTempMail inbox — Netflix's verification email arrives in seconds.</li>
          <li>Click the link to confirm your account. You're ready to stream.</li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Important caveat</h2>
        <p className="mt-3 leading-relaxed">
          Because the inbox expires, you'll lose the ability to recover the account through email if you ever forget the password. If the Netflix account is going to hold a real subscription or your watch history, use your real email instead. For free trials, regional previews and short experiments, a temp email is the perfect tool.
        </p>
      </article>
    </PageShell>
  );
}
