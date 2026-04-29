import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import { Zap, ShieldCheck, Wand2, Trash2, Globe2, Lock } from "lucide-react";

export const Route = createFileRoute("/free-temporary-email-generator")({
  head: () => ({
    meta: [
      { title: "Free Temporary Email Generator — Instant Disposable Inbox | MyTempMail" },
      { name: "description", content: "Generate a free temporary email address instantly. No signup, no app, no spam. Pick a custom name and domain — your inbox is ready in one click." },
      { name: "keywords", content: "free temporary email, temp mail generator, disposable email, throwaway email, free temp mail, instant email" },
      { property: "og:title", content: "Free Temporary Email Generator — MyTempMail" },
      { property: "og:description", content: "Free, instant, disposable email — generate your inbox in one click." },
    ],
  }),
  component: FreeTempEmailGeneratorPage,
});

const features = [
  { icon: Zap, t: "Instant inbox", d: "Get a working email address in under a second — no waiting, no setup." },
  { icon: Wand2, t: "Custom names", d: "Pick your own name before the @ and choose from a clean list of domains." },
  { icon: Globe2, t: "Real-time delivery", d: "Messages appear in your inbox the moment they're sent — no manual refresh." },
  { icon: Trash2, t: "Auto-deleted", d: "When the timer runs out, the address and every message in it disappear." },
  { icon: ShieldCheck, t: "Built for privacy", d: "No signup, no profile, no tracking — your real address stays yours." },
  { icon: Lock, t: "Free forever", d: "No premium tier, no usage caps, no credit card required." },
];

function FreeTempEmailGeneratorPage() {
  return (
    <PageShell
      eyebrow="Free generator"
      title="Free Temporary Email Generator"
      description="Generate a working disposable inbox in one click. No signup, no install, no spam — and gone the moment you don't need it any more."
    >
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
        <h2 className="text-xl font-semibold">Get your free temp email now</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          A real, working email address in under a second. No registration. No commitment.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Generate temp email
        </Link>
      </div>

      <article className="prose prose-neutral mt-12 max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">What is a temp email generator?</h2>
        <p className="mt-3 leading-relaxed">
          A temporary email generator is a free tool that creates a real, working email address you can use for a short period of time. The address accepts inbound messages just like any other inbox — but instead of living in your real account forever, it expires after a set amount of time and is wiped from existence. Perfect for any one-time signup, download, or verification where you'd rather not hand over your real address.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Why use a free temp email?</h2>
        <p className="mt-3 leading-relaxed">
          Almost every modern website asks for an email before it lets you do anything — read an article, download a template, claim a coupon, try a tool. Each one of those tiny exchanges hands a piece of your identity to a company that may email you forever, sell your address to marketers, or accidentally leak it in the next data breach. A free temporary email generator lets you sidestep all of that with a single click.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">What you get with MyTempMail</h2>
      </article>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.t} className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">{f.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </div>

      <article className="prose prose-neutral mt-12 max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">How to generate a free temporary email</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6">
          <li>Click the <strong>Generate temp email</strong> button above.</li>
          <li>A brand-new disposable address is created for you instantly.</li>
          <li>Copy the address and paste it into any signup form, download gate, or verification page.</li>
          <li>Watch the message arrive in your inbox in real time and use the link or code inside.</li>
          <li>When you're done, hit Delete — or simply walk away and let it expire automatically.</li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Is it really 100% free?</h2>
        <p className="mt-3 leading-relaxed">
          Yes. There is no premium tier, no credit card prompt, no "first three inboxes free" trick. The full product is free for everyone, forever. We don't sell your data because we don't collect any.
        </p>
      </article>
    </PageShell>
  );
}
