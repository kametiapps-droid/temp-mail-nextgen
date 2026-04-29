import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import { seo } from "../lib/seo";

export const Route = createFileRoute("/terms-of-service")({
  head: () => seo({
    path: "/terms-of-service",
    title: "Terms of Service — MyTempMail",
    description: "The terms that govern your use of MyTempMail — written in plain English.",
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of Service"
      description="Last updated: April 28, 2026. By using MyTempMail, you agree to these terms."
    >
      <article className="prose prose-neutral max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">1. The service</h2>
        <p className="mt-3 leading-relaxed">
          MyTempMail provides free, short-lived disposable email addresses. The service is offered as-is, without warranties of any kind, and is intended for lawful one-time signups, downloads, and similar uses.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">2. Acceptable use</h2>
        <p className="mt-3 leading-relaxed">You agree not to use MyTempMail to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Commit fraud, evade bans, or impersonate other people.</li>
          <li>Sign up for accounts that hold money, identity documents, or sensitive personal information.</li>
          <li>Receive or store illegal content of any kind.</li>
          <li>Abuse the service through automation that overwhelms our infrastructure.</li>
          <li>Bypass anti-abuse mechanisms (rate limits, captchas, etc.).</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">3. No guarantees</h2>
        <p className="mt-3 leading-relaxed">
          Because inboxes are temporary by design, we do not guarantee delivery, retention, or recovery of any message. Inboxes and their contents may expire and be deleted at any time. Do not use MyTempMail for anything that requires durable email.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">4. Privacy</h2>
        <p className="mt-3 leading-relaxed">
          Our handling of data is described in the <a href="/privacy-policy" className="text-primary underline">Privacy Policy</a>. By using the service you accept that policy.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">5. Service changes</h2>
        <p className="mt-3 leading-relaxed">
          We may add, change, or remove features at any time, including the available domains, expiry timers, and acceptable-use rules. We may also throttle or block usage that we reasonably believe to be abusive.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">6. Liability</h2>
        <p className="mt-3 leading-relaxed">
          To the maximum extent permitted by law, MyTempMail and its operators are not liable for any direct or indirect loss, damage or inconvenience arising from use of the service, including loss of access to accounts created with a temporary address.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">7. Termination</h2>
        <p className="mt-3 leading-relaxed">
          We may suspend access to the service for any user we believe to be in breach of these terms, without notice and at our discretion.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">8. Contact</h2>
        <p className="mt-3 leading-relaxed">
          Questions about these terms? Write to us at <a href="mailto:legal@mytempmail.pro" className="text-primary underline">legal@mytempmail.pro</a>.
        </p>
      </article>
    </PageShell>
  );
}
