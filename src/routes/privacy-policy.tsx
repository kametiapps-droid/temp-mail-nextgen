import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MyTempMail" },
      { name: "description", content: "How MyTempMail handles your data — short version: we collect almost none and we don't sell what we have." },
      { property: "og:title", content: "Privacy Policy — MyTempMail" },
      { property: "og:description", content: "Our privacy commitments, in plain English." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy"
      title="Privacy Policy"
      description="Last updated: April 28, 2026. We've tried to write this in plain English, not in legalese."
    >
      <article className="prose prose-neutral max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">The short version</h2>
        <p className="mt-3 leading-relaxed">
          MyTempMail is a disposable email service. By design, we collect as little personal data as possible. We do not sell your data, we do not run advertising tracking pixels, and we do not require an account.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">What we collect</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li><strong>Inbox contents.</strong> Messages sent to a temporary address you generate are stored only for as long as that inbox is alive. When the inbox expires (or you delete it), the messages are permanently removed.</li>
          <li><strong>Operational logs.</strong> Standard server logs (IP address, request path, timestamp, user-agent) are kept for a short period to fight abuse and keep the service running. They are not linked to specific inboxes.</li>
          <li><strong>Anti-abuse signals.</strong> If you trigger a captcha or rate limit, the relevant signal is held briefly to prevent abuse.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">What we don't collect</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>Your real email address.</li>
          <li>Your name, age, gender, location data, or contacts.</li>
          <li>Behavioural advertising profiles or third-party ad tracking.</li>
          <li>Any kind of long-term link between your browser and a specific inbox.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">How long we keep data</h2>
        <p className="mt-3 leading-relaxed">
          Inbox contents are wiped when the inbox expires or is deleted. Operational logs are rotated on a short schedule (typically a few days). We do not maintain long-term archives of either.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Cookies</h2>
        <p className="mt-3 leading-relaxed">
          We use a small amount of local storage in your browser to remember which inbox you generated, so that opening a new tab shows you the same inbox. We do not use third-party tracking cookies for advertising.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Third parties</h2>
        <p className="mt-3 leading-relaxed">
          We use a small set of vetted infrastructure providers (CDN, hosting, captcha) to run the service. They process minimum-necessary data on our behalf and do not receive your inbox contents.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Your rights</h2>
        <p className="mt-3 leading-relaxed">
          You can delete any inbox you create at any time using the Delete button. Because we don't tie inboxes to identities, there is no account to close. If you have a specific question about your data, write to us at <a href="mailto:privacy@mytempmail.pro" className="text-primary underline">privacy@mytempmail.pro</a>.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Changes to this policy</h2>
        <p className="mt-3 leading-relaxed">
          If we update this policy, we'll change the date at the top of the page. Major changes will be highlighted on the home page for a reasonable period.
        </p>
      </article>
    </PageShell>
  );
}
