import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — MyTempMail" },
      { name: "description", content: "Frequently asked questions about disposable email and MyTempMail — pricing, privacy, attachments, custom names and more." },
      { property: "og:title", content: "FAQ — MyTempMail" },
      { property: "og:description", content: "Answers to the most common questions about disposable email." },
    ],
  }),
  component: FAQPage,
});

const groups: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "The basics",
    items: [
      {
        q: "What is MyTempMail?",
        a: "MyTempMail is a free, no-signup service that gives you a real, working email address that lives for a short time and then disappears — perfect for one-time signups, downloads, and trials.",
      },
      {
        q: "Is it really free?",
        a: "Yes. 100% free, forever. No credit card, no premium tier, no hidden upsell. We don't sell your data because we don't collect any.",
      },
      {
        q: "Do I need to register or install anything?",
        a: "No. Open the page, click Generate, and you have a working inbox in under a second. Nothing to install, nothing to configure.",
      },
    ],
  },
  {
    title: "Privacy & safety",
    items: [
      {
        q: "Is it safe and private?",
        a: "Yes. We don't ask for your name, phone or real email, and we don't track who owns which inbox. Once an inbox expires, every message in it is wiped — there's nothing left to leak or hand over.",
      },
      {
        q: "Can other people read my messages?",
        a: "Anyone who knows the exact address of an inbox could in principle read what's in it — that's why disposable email is the wrong tool for sensitive content like passwords for important accounts. For typical use (download links, trial signups, verification codes you act on immediately) it's perfectly safe.",
      },
      {
        q: "Do you keep logs of who used what address?",
        a: "We don't tie inboxes to identities. We keep only the minimum operational logs needed to run the service and fight abuse, and they're rotated quickly.",
      },
    ],
  },
  {
    title: "Using the inbox",
    items: [
      {
        q: "How long does the email last?",
        a: "Each address has an expiry timer (shown next to your address as 'Expires in…'). Once it expires, the address and all its messages are deleted automatically.",
      },
      {
        q: "Can I receive attachments?",
        a: "Yes. Most common attachment types — PDFs, images, documents — are accepted and shown in the message view, just like a regular inbox.",
      },
      {
        q: "Can I send emails from my temp address?",
        a: "No. MyTempMail is receive-only by design. This keeps the service fast, abuse-free, and impossible to use for spam or impersonation.",
      },
      {
        q: "Can I pick my own email name and domain?",
        a: "Yes — click 'Custom email' on the home page to choose your own local part (the bit before the @) and pick a domain from the list.",
      },
      {
        q: "Will sites accept a temporary address?",
        a: "The vast majority do. Some banks, government and identity-verification sites block disposable domains. For everything else, it works perfectly.",
      },
    ],
  },
  {
    title: "Account recovery & limits",
    items: [
      {
        q: "Can I get an old inbox back after it expires?",
        a: "No. The whole point of disposable email is that the inbox is wiped when it expires. There is no recovery, no archive, and no support workflow that can restore a deleted address.",
      },
      {
        q: "Is there a limit on how many inboxes I can create?",
        a: "There are gentle anti-abuse limits to keep the service fast for everyone. Normal human use will never hit them.",
      },
      {
        q: "Can I use MyTempMail for my main accounts (bank, work, etc.)?",
        a: "Please don't. Use your real email for anything you want to keep long-term. Temporary email is the right tool only when you don't need the account afterwards.",
      },
    ],
  },
];

function FAQPage() {
  return (
    <PageShell
      eyebrow="FAQ"
      title="Frequently asked questions"
      description="Quick answers to the questions we get asked most often. Can't find what you're looking for? Drop us a line."
    >
      <div className="space-y-12">
        {groups.map((g) => (
          <FAQGroup key={g.title} title={g.title} items={g.items} />
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
        <h3 className="text-xl font-semibold">Still have a question?</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          We try to keep things simple. If something isn't clear, we'd love to hear from you.
        </p>
        <Link
          to="/contact"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Contact us
        </Link>
      </div>
    </PageShell>
  );
}

function FAQGroup({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section>
      <h2 className="mb-4 inline-flex items-center gap-2 text-xl font-semibold">
        <Sparkles className="h-4 w-4 text-primary" />
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={item.q}
              className={`overflow-hidden rounded-2xl border bg-card transition ${
                isOpen ? "border-primary/40 shadow-sm" : "border-border"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-accent/40"
                aria-expanded={isOpen}
              >
                <span className="text-base font-medium">{item.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
