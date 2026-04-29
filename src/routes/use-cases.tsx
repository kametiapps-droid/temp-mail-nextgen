import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import {
  Download,
  Clock,
  ShoppingBag,
  Newspaper,
  Gamepad2,
  UserX,
  Briefcase,
  ShieldCheck,
  Wifi,
  HeartHandshake,
} from "lucide-react";

import { seo } from "../lib/seo";

export const Route = createFileRoute("/use-cases")({
  head: () => seo({
    path: "/use-cases",
    title: "Use Cases — MyTempMail",
    description: "When to use a disposable email: signups, downloads, free trials, online forms, public Wi-Fi, and more. Keep your real inbox safe.",
  }),
  component: UseCasesPage,
});

const cases = [
  {
    icon: Download,
    title: "Free downloads & gated content",
    text: "Ebooks, whitepapers, PDF templates, free Figma kits, free music, free anything-behind-an-email-form. You came for the file, not for the newsletter — a temp address gets you the file without the lifetime subscription.",
  },
  {
    icon: Clock,
    title: "Free trials & demos",
    text: "Try a SaaS tool for an afternoon. Sample a streaming service for a week. Walk through a course preview. With a disposable inbox you can evaluate something on its merits, without worrying about an auto-renewal email landing in your real inbox six months later.",
  },
  {
    icon: ShoppingBag,
    title: "One-off online shopping",
    text: "Ordering once from a small store you'll likely never use again? Use a temp address for the receipt. The store gets to send you the order confirmation. You don't get four years of \"abandoned cart\" emails.",
  },
  {
    icon: Newspaper,
    title: "Reading paywalled articles",
    text: "More and more sites ask for an email just to read a single article. A disposable inbox gets you in without committing your real address to a publication you might never read again.",
  },
  {
    icon: Gamepad2,
    title: "Game accounts & forums",
    text: "Sign up to a game launcher for a single match. Post one comment on a forum. Reserve a username on a niche community. Stay anonymous when the relationship is short by design.",
  },
  {
    icon: UserX,
    title: "Surveys, beta tests & giveaways",
    text: "Claim the prize, finish the survey, get the free credit — without joining the company's permanent mailing list as part of the deal.",
  },
  {
    icon: Briefcase,
    title: "Developer & QA testing",
    text: "Spin up fresh inboxes on demand to test signup flows, password resets, magic links, email verification, drip campaigns, and unsubscribe pages. No more polluting your real inbox with test mail.",
  },
  {
    icon: ShieldCheck,
    title: "Protection against future breaches",
    text: "If a site you signed up to last year gets breached next year, a temp address means your real email never appears in the dump. Free protection, applied retroactively.",
  },
  {
    icon: Wifi,
    title: "Public Wi-Fi sign-in pages",
    text: "Airport Wi-Fi, café Wi-Fi, hotel Wi-Fi — most of them want your email before they let you online. A disposable address satisfies the form without enrolling you in their loyalty program.",
  },
  {
    icon: HeartHandshake,
    title: "Selling, swapping & marketplace deals",
    text: "Putting an item on a buy/sell site or a Discord trade group? Use a temp address as the contact email so casual buyers and bots can't follow you home after the sale is done.",
  },
];

function UseCasesPage() {
  return (
    <PageShell
      eyebrow="Use cases"
      title="When disposable email saves the day"
      description="A short tour of the everyday situations where a temp address beats handing out your real one."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {cases.map((c) => (
          <div
            key={c.title}
            className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">{c.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
        <h3 className="text-xl font-semibold">Found your use case?</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Generate a disposable inbox in one click and put your real address back in the drawer.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Generate a temp email
        </Link>
      </div>
    </PageShell>
  );
}
