import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import { seo } from "../lib/seo";

export const Route = createFileRoute("/about")({
  head: () => seo({
    path: "/about",
    title: "About — MyTempMail",
    description: "About MyTempMail — our mission, our team, our principles. Why we built a disposable email service.",
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Built to keep inboxes calm"
      description="A small team, a focused product, and one stubborn belief: signing up to a website shouldn't cost you your inbox."
    >
      <article className="prose prose-neutral max-w-none text-foreground/90">
        <h2 className="text-2xl font-semibold tracking-tight">Why we exist</h2>
        <p className="mt-3 leading-relaxed">
          The modern web runs on email gates. Want to read an article? Email. Want to download a template? Email. Want to try a tool for five minutes to see if it solves your problem? Email, plus a 14-day countdown to the moment you forgot to cancel. Every one of those tiny exchanges leaves a permanent breadcrumb behind — your real address, attached to a company you may never interact with again.
        </p>
        <p className="mt-3 leading-relaxed">
          MyTempMail exists because we got tired of cleaning up after the internet. We wanted a one-click way to hand over a working inbox, get the link or the file or the receipt we needed, and then have the whole thing disappear without a trace. So we built it.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">What we believe</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li><strong>Privacy is the default, not a feature.</strong> You shouldn't have to enable a setting or upgrade a plan to keep your real address private.</li>
          <li><strong>Free should mean free.</strong> No "lite" version, no surprise paywall after the third inbox, no upsell pop-ups in the corner.</li>
          <li><strong>If we don't collect it, we can't lose it.</strong> No accounts, no profiles, no analytics tied to who you are.</li>
          <li><strong>Fast beats fancy.</strong> An inbox should appear in under a second and update in real time. Anything more is a distraction.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Who we are</h2>
        <p className="mt-3 leading-relaxed">
          We're a small, independent team of engineers and designers who care about boring software done well. We don't have a sales department because there's nothing to sell. We don't have an ads team because we don't run ads. We just keep the service running, the inboxes wiping, and the real users (you) in control of their real inbox.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">What we don't do</h2>
        <p className="mt-3 leading-relaxed">
          We don't sell your data. We don't profile you. We don't read your messages. We don't keep them after they expire. We don't share anything with marketers. We don't make you watch a video before you can use the product. We don't ask you to "create an account to continue" — because the whole point is that you shouldn't have to.
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
          <h3 className="text-xl font-semibold">Want to chat?</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Bug reports, feedback, partnership ideas, or just a hello — we'd love to hear from you.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Get in touch
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
