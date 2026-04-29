import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import { Instagram, ShieldCheck, EyeOff, UserX, Zap, Trash2 } from "lucide-react";

export const Route = createFileRoute("/temp-mail-for-instagram")({
  head: () => ({
    meta: [
      { title: "Temp Mail for Instagram — Create Anonymous Instagram Accounts | MyTempMail" },
      { name: "description", content: "Use a free temp mail to sign up for Instagram without giving away your real email. Perfect for second accounts, testing, and staying anonymous." },
      { name: "keywords", content: "temp mail for instagram, instagram temp email, fake email for instagram, anonymous instagram account, disposable email instagram" },
      { property: "og:title", content: "Temp Mail for Instagram — MyTempMail" },
      { property: "og:description", content: "Sign up for Instagram with a disposable email — keep your real inbox private." },
    ],
  }),
  component: InstagramTempMailPage,
});

const reasons = [
  { icon: Instagram, t: "Second / burner accounts", d: "Spin up an extra Instagram account for a niche interest, a side project or a brand without linking it to your real email." },
  { icon: EyeOff, t: "Anonymous browsing", d: "Create a viewer account that isn't tied to your identity — perfect for keeping personal life and online life separate." },
  { icon: ShieldCheck, t: "Avoid spam follow-ups", d: "Skip the marketing emails, partner offers and weekly digest mails by signing up with an inbox that won't survive the week." },
  { icon: UserX, t: "Stay private after a breach", d: "If Instagram or a third-party app you connect to it gets breached, your real email never appears in the dump." },
  { icon: Zap, t: "Fast OTP delivery", d: "The Instagram verification code lands in your temp inbox in real time — no need to refresh anything." },
  { icon: Trash2, t: "Clean exit", d: "Done with the account? Delete the temp inbox and the original signup mail goes with it." },
];

function InstagramTempMailPage() {
  return (
    <PageShell
      eyebrow="Instagram"
      title="Temp Mail for Instagram"
      description="Use a free disposable email to sign up for Instagram — perfect for second accounts, anonymous browsing, and keeping your real inbox out of social-media databases."
    >
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
        <h2 className="text-xl font-semibold">Get a temp email for Instagram</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          One click and you have a working address ready to receive your Instagram verification code.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Generate temp email
        </Link>
      </div>

      <article className="prose prose-neutral mt-12 max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">Why use a temp email for Instagram?</h2>
        <p className="mt-3 leading-relaxed">
          Instagram is one of the most data-hungry signup flows on the internet. The address you give it doesn't just receive a single confirmation email — it becomes the long-term anchor for password resets, login alerts, story notifications, partner offers and "we miss you" mail for years to come. If you're creating a second account, an experimental brand profile, or simply don't want every IG signup feeding back to your real inbox, a disposable email is the clean fix.
        </p>
        <p className="mt-3 leading-relaxed">
          A temp address works exactly like a real one for the signup itself: Instagram sends a 6-digit verification code, the code arrives instantly in your MyTempMail inbox, you type it in, and the account is created. Nothing else is different.
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
        <h2 className="text-2xl font-semibold tracking-tight">How to sign up for Instagram with temp mail</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6">
          <li>Click <strong>Generate temp email</strong> above and copy your new disposable address.</li>
          <li>Open the Instagram signup page and paste the address into the email field.</li>
          <li>Fill in the rest of the form (username, password, name) as usual.</li>
          <li>Watch your MyTempMail inbox — Instagram's 6-digit verification code arrives in seconds.</li>
          <li>Type the code back into Instagram to confirm the address. You're in.</li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Important caveat</h2>
        <p className="mt-3 leading-relaxed">
          Because the inbox expires, so does your ability to recover the account through email if you ever lose your password. If the Instagram account is meaningful to you (your business, your main profile, anything you'd be sad to lose), use your real email instead and consider a password manager. For burner accounts and short-term experiments, a temp email is exactly the right tool.
        </p>
      </article>
    </PageShell>
  );
}
