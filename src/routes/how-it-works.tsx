import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import { MousePointerClick, Inbox, Mail, Trash2 } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — MyTempMail" },
      { name: "description", content: "How MyTempMail generates a disposable inbox in one click and keeps your real email private." },
      { property: "og:title", content: "How it works — MyTempMail" },
      { property: "og:description", content: "Four simple steps from one click to a working disposable inbox." },
    ],
  }),
  component: HowItWorksPage,
});

const steps = [
  {
    icon: MousePointerClick,
    title: "1. Click Generate",
    text: "Open MyTempMail and hit Generate. We invent a brand new email address on one of our domains in under a second — or you can pick a custom name and domain if you prefer.",
  },
  {
    icon: Inbox,
    title: "2. Use it anywhere that asks for an email",
    text: "Paste the address into a signup form, a download gate, a checkout page or anywhere else that wants an email. To the website, it's a perfectly normal address.",
  },
  {
    icon: Mail,
    title: "3. Watch messages appear in real time",
    text: "When the site sends a confirmation, a download link, a receipt or a verification code, it shows up in your inbox instantly — no refresh required.",
  },
  {
    icon: Trash2,
    title: "4. Walk away — we'll clean up",
    text: "When the timer runs out, the address and every message it received are wiped from our system. You don't have to remember to log out, delete anything or unsubscribe.",
  },
];

function HowItWorksPage() {
  return (
    <PageShell
      eyebrow="How it works"
      title="From one click to a working inbox"
      description="No accounts, no install, no learning curve. The whole flow takes less time than reading this sentence."
    >
      <ol className="space-y-5">
        {steps.map((s) => (
          <li
            key={s.title}
            className="flex items-start gap-5 rounded-2xl border border-border bg-card p-6 transition hover:shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-xl font-semibold">A peek behind the scenes</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Under the hood, MyTempMail runs a real mail server on the domains you see in the address picker. When you generate an inbox, we register that address with the server and open a live channel to your browser. Anything delivered to it is shown to you immediately and stored in a small, isolated database tied only to that inbox.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          When the inbox expires (or you hit Delete), we drop the address from the mail server, wipe the messages, and remove the database record. There's no archive, no backup tape, no analytics dashboard — once it's gone, it's gone for good.
        </p>
      </section>

      <div className="mt-10 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
        <h3 className="text-xl font-semibold">See it in action</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Generate your first disposable inbox right now. It really is one click.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Try it now
        </Link>
      </div>
    </PageShell>
  );
}
