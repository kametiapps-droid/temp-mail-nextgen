import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — MyTempMail" },
      { name: "description", content: "Important things to keep in mind about using MyTempMail's disposable email service." },
      { property: "og:title", content: "Disclaimer — MyTempMail" },
      { property: "og:description", content: "Important things to keep in mind about MyTempMail." },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <PageShell
      eyebrow="Disclaimer"
      title="A few important reminders"
      description="The good news is short. The fine print is shorter."
    >
      <article className="prose prose-neutral max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">Temporary means temporary</h2>
        <p className="mt-3 leading-relaxed">
          Every inbox you create on MyTempMail is, by design, short-lived. When the timer expires (or you click Delete), the address is unregistered and every message ever delivered to it is permanently wiped. There is no backup, no archive, and no recovery. If you'd be upset to lose something, please don't have it sent to a temp address.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Don't use it for important accounts</h2>
        <p className="mt-3 leading-relaxed">
          Disposable email is the wrong tool for any account you want to keep long-term — banks, taxes, healthcare, insurance, work tools, identity verification, anything that holds money or personal documents. Once the address expires you'll lose the only path to recovering that account.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">No guaranteed delivery</h2>
        <p className="mt-3 leading-relaxed">
          Some senders, especially banks and identity-verification providers, deliberately reject mail to disposable domains. We can't change their behaviour. If you're not seeing a message you were expecting, the sender's filter is the most likely cause.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Use it lawfully</h2>
        <p className="mt-3 leading-relaxed">
          MyTempMail is intended for normal, lawful one-time signups, downloads, trials, and similar uses. Don't use it to commit fraud, evade bans, impersonate other people, or receive illegal content. Abusive usage will be blocked.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Service availability</h2>
        <p className="mt-3 leading-relaxed">
          We work hard to keep MyTempMail fast and reliable, but we don't promise 100% uptime, retention, or feature stability. The service is provided as-is and may change at any time.
        </p>

        <p className="mt-10 text-sm text-muted-foreground">
          Full terms are available on the <a href="/terms-of-service" className="text-primary underline">Terms of Service</a> page, and our data practices are described in the <a href="/privacy-policy" className="text-primary underline">Privacy Policy</a>.
        </p>
      </article>
    </PageShell>
  );
}
