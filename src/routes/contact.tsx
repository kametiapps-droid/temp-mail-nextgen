import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import { Mail, MessageSquare, Bug, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MyTempMail" },
      { name: "description", content: "Get in touch with the MyTempMail team — feedback, bug reports, partnership ideas, or just a hello." },
      { property: "og:title", content: "Contact — MyTempMail" },
      { property: "og:description", content: "Get in touch with the MyTempMail team." },
    ],
  }),
  component: ContactPage,
});

const channels = [
  {
    icon: Bug,
    title: "Bug reports",
    text: "Something broken or behaving oddly? Let us know what you saw and what you expected — we'll investigate quickly.",
    label: "support@mytempmail.pro",
    href: "mailto:support@mytempmail.pro",
  },
  {
    icon: Lightbulb,
    title: "Feedback & ideas",
    text: "Got an idea for a feature, an integration, or a small tweak that would make your life easier? We read everything.",
    label: "hello@mytempmail.pro",
    href: "mailto:hello@mytempmail.pro",
  },
  {
    icon: MessageSquare,
    title: "Press & partnerships",
    text: "Writing about us, building a tool that integrates with us, or want to syndicate our content? Drop us a line.",
    label: "press@mytempmail.pro",
    href: "mailto:press@mytempmail.pro",
  },
];

function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact"
      title="We'd love to hear from you"
      description="No tickets, no automated chatbots, no hold music. Just a real human reading your message and getting back to you."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {channels.map((c) => (
          <a
            key={c.title}
            href={c.href}
            className="group block rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">{c.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
              <Mail className="h-4 w-4" />
              {c.label}
            </p>
          </a>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        We aim to reply within two working days. For most questions you'll find the answer on the FAQ page first.
      </p>
    </PageShell>
  );
}
