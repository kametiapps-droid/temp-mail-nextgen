import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import { ShoppingBag, Receipt, ShieldCheck, EyeOff, Zap, Trash2 } from "lucide-react";

import { seo } from "../lib/seo";

export const Route = createFileRoute("/temp-mail-for-amazon")({
  head: () => seo({
    path: "/temp-mail-for-amazon",
    title: "Temp Mail for Amazon — Sign Up & Receive Verification Codes | MyTempMail",
    description: "Use a free temp mail to sign up for Amazon, claim a free trial, or receive a one-time order receipt without exposing your real inbox.",
    keywords: "temp mail for amazon, amazon temp email, fake email for amazon, disposable email amazon, amazon prime trial email",
  }),
  component: AmazonTempMailPage,
});

const reasons = [
  { icon: ShoppingBag, t: "One-off purchases", d: "Order once from a marketplace seller you'll never use again — get the receipt, skip the lifetime promo emails." },
  { icon: Receipt, t: "Free trials & Prime previews", d: "Try Prime, Audible, Kindle Unlimited or any partner trial without joining the permanent renewal list." },
  { icon: EyeOff, t: "Keep shopping habits private", d: "Your purchase history, recommendations and \"customers also bought\" mail stay in a throwaway inbox." },
  { icon: Zap, t: "Real-time OTP delivery", d: "Amazon's 6-digit verification code arrives in your temp inbox in seconds — no need to refresh." },
  { icon: ShieldCheck, t: "Spam-free signup", d: "After verification, the inbox expires — and so does the marketing chain." },
  { icon: Trash2, t: "No long-term trail", d: "Done with the order? Delete the inbox and the entire confirmation history goes with it." },
];

function AmazonTempMailPage() {
  return (
    <PageShell
      eyebrow="Amazon"
      title="Temp Mail for Amazon"
      description="Use a free disposable email to sign up for Amazon — perfect for one-off purchases, free trials, and keeping your real inbox out of giant retail databases."
    >
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
        <h2 className="text-xl font-semibold">Get a temp email for Amazon</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          One click and you have a working address ready to receive your Amazon verification code.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Generate temp email
        </Link>
      </div>

      <article className="prose prose-neutral mt-12 max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">Why use a temp email for Amazon?</h2>
        <p className="mt-3 leading-relaxed">
          Few companies email you as enthusiastically as Amazon. The address you use to sign up isn't only the recipient of your order receipts — it becomes the long-term anchor for daily deal alerts, recommendation emails, "you forgot something in your cart" reminders, partner offers, and a steady drip of marketing for years to come. A disposable email lets you pick up the order, the trial or the verification you came for, and then quietly close the door behind you.
        </p>
        <p className="mt-3 leading-relaxed">
          Signup with temp mail works exactly like any other Amazon signup: you receive a 6-digit verification code in your MyTempMail inbox in real time, type it back into Amazon, and the account is ready.
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
        <h2 className="text-2xl font-semibold tracking-tight">How to sign up for Amazon with temp mail</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6">
          <li>Click <strong>Generate temp email</strong> above and copy your new disposable address.</li>
          <li>Open the Amazon signup page and paste the address into the email field.</li>
          <li>Set a password and continue with the rest of the form as usual.</li>
          <li>Watch your MyTempMail inbox — Amazon's verification code arrives in seconds.</li>
          <li>Type the code back into Amazon to confirm. You're in.</li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Important caveat</h2>
        <p className="mt-3 leading-relaxed">
          Once the temp inbox expires, you lose the ability to recover the Amazon account through email — and crucially, any orders, billing history or saved payment methods on it become harder to manage. If the account is going to hold real purchases or a long-term subscription, use your real email. For one-off buys, free trials and short experiments, a temp email is the cleaner choice.
        </p>
      </article>
    </PageShell>
  );
}
