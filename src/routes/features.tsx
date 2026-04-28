import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import {
  Zap,
  Globe2,
  ShieldCheck,
  Wand2,
  RefreshCw,
  Trash2,
  Smartphone,
  Lock,
  Infinity as InfinityIcon,
} from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — MyTempMail" },
      { name: "description", content: "Real-time inbox, custom names, multiple domains, cross-tab sync, and zero tracking." },
      { property: "og:title", content: "Features — MyTempMail" },
      { property: "og:description", content: "Everything that makes MyTempMail the cleanest disposable email service." },
    ],
  }),
  component: FeaturesPage,
});

const features = [
  {
    icon: Zap,
    title: "Real-time inbox",
    text: "Messages appear in your inbox the second they're delivered — no refresh button, no waiting, no manual sync.",
  },
  {
    icon: Wand2,
    title: "Custom name & domain",
    text: "Pick any name you like and choose from a rotating list of clean domains. Memorable when you need it, random when you don't.",
  },
  {
    icon: Globe2,
    title: "Synced across tabs",
    text: "Open MyTempMail in ten browser tabs — they all show the same inbox, the same messages, in real time.",
  },
  {
    icon: RefreshCw,
    title: "Persists on refresh",
    text: "Accidentally close the tab? Reload the page? Your inbox is right where you left it, until it expires.",
  },
  {
    icon: Trash2,
    title: "One-click delete",
    text: "Done with an inbox before it expires? Hit Delete and every message is wiped immediately.",
  },
  {
    icon: ShieldCheck,
    title: "Spam & abuse shield",
    text: "Built-in anti-abuse keeps the service fast and free for real humans, without making you jump through hoops.",
  },
  {
    icon: Smartphone,
    title: "Works on any device",
    text: "Phone, tablet, laptop, public library PC — if it has a browser, it has MyTempMail. No app to install.",
  },
  {
    icon: Lock,
    title: "Zero tracking",
    text: "We don't ask who you are and we don't try to find out. No accounts, no profile, no ad pixels watching your inbox.",
  },
  {
    icon: InfinityIcon,
    title: "Free forever",
    text: "No premium tier, no usage caps, no credit card on file. The whole product, free, for everyone.",
  },
];

function FeaturesPage() {
  return (
    <PageShell
      eyebrow="Features"
      title="Everything you'd want, nothing you wouldn't"
      description="The whole point of disposable email is to keep things simple. These are the features we kept — and the ones we deliberately left out."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
        <h3 className="text-xl font-semibold">Ready to try it?</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Generate your first disposable inbox in one click — no signup, no install.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Open my inbox
        </Link>
      </div>
    </PageShell>
  );
}
