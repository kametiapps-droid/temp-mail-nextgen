import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/PageShell";
import { seo } from "../lib/seo";

export const Route = createFileRoute("/what-is-temporary-email")({
  head: () => seo({
    path: "/what-is-temporary-email",
    title: "What is Temporary Email? — Complete Guide | MyTempMail",
    description: "A complete guide to temporary, disposable, and throwaway email addresses. Learn how they work, why they matter, and when to use them.",
    keywords: "what is temporary email, disposable email guide, throwaway email, temp mail explained, fake email, anonymous email",
  }),
  component: WhatIsTempEmailPage,
});

function WhatIsTempEmailPage() {
  return (
    <PageShell
      eyebrow="Guide"
      title="What is a Temporary Email?"
      description="Disposable, throwaway, burner, 10-minute mail — different names, the same idea. Here's everything you need to know."
    >
      <article className="prose prose-neutral max-w-none text-foreground/90">
        <p className="lead text-lg leading-relaxed">
          A <strong>temporary email</strong> is a real, working email address that lives for a short period of time and then disappears — along with every message ever sent to it. You don't sign up. You don't pick a password. You don't give away your real identity. You just open a page, click a button, and seconds later you have an inbox you can use.
        </p>

        <p className="mt-5 leading-relaxed">
          People also call it <em>disposable email</em>, <em>throwaway email</em>, <em>burner email</em>, or <em>10-minute mail</em>. The name changes, but the concept doesn't: it's an inbox you use once, for one purpose, and then walk away from. Forever.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Why temporary email exists</h2>
        <p className="mt-3 leading-relaxed">
          Almost every website on the internet asks for your email address. To download a PDF. To read one article. To claim a coupon. To start a free trial. To leave a comment. To create a forum account you'll use exactly twice. Each of those tiny exchanges hands a piece of your identity to a stranger — a stranger who can email you forever, sell your address to other companies, or accidentally leak it in the next data breach.
        </p>
        <p className="mt-3 leading-relaxed">
          A temporary email lets you participate in the modern web without paying that price. You hand over an address that works just long enough to receive a confirmation link, a download, or a verification code, and then quietly evaporates. The website gets what it wanted. You get what you wanted. Nobody owns your inbox afterwards.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">How temporary email actually works</h2>
        <p className="mt-3 leading-relaxed">
          Under the hood, a temporary email service runs a normal mail server on a domain it controls — for example, <code>mytempmail.pro</code>. When you visit the site, the server invents a random address on that domain (or accepts a custom name you choose) and starts listening for messages sent to it. The address is real: any mail server in the world can deliver to it.
        </p>
        <p className="mt-3 leading-relaxed">
          Incoming messages are stored in a small, short-lived database that's tied to that single inbox. While the address is alive, you see new messages appear in real time — usually within a second or two of the sender hitting "send". When the timer runs out, the address is removed from the mail server, and the messages, attachments, and metadata are wiped from the database. There's nothing left to subpoena, nothing left to leak, and nothing left for the next person who happens to type the same address into a signup form.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">The privacy story</h2>
        <p className="mt-3 leading-relaxed">
          Your real email address is one of the most valuable pieces of information about you. It's the master key to your accounts. It's the link between your name and every newsletter, every store, every forum, every leaked database. Once it's out, it's out — you can't take it back, and you'll be deleting unwanted mail from it for the rest of your life.
        </p>
        <p className="mt-3 leading-relaxed">
          A temporary inbox is a one-way door. You can receive a single confirmation email through it, click the link, and the entire path back to you closes the moment the timer expires. The site you signed up to has nothing useful on file. Marketers can't follow you. Data brokers can't add you to a list. Future breaches can't expose you. And you didn't have to lie, install anything, or learn anything new to get all of that — you just used a different address for one specific task.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">When you should use a temporary email</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li><strong>One-time downloads</strong> — ebooks, whitepapers, templates, free assets behind an email gate.</li>
          <li><strong>Free trials</strong> — try a SaaS, a streaming service or a course without ending up on the renewal email list.</li>
          <li><strong>Online shopping at unfamiliar stores</strong> — order, get the receipt, never see a promo email again.</li>
          <li><strong>Reading paywalled or "register to read" articles</strong> — see the content without becoming part of someone's funnel.</li>
          <li><strong>Forum, game and community signups</strong> — stay anonymous when you only plan to comment a handful of times.</li>
          <li><strong>Surveys, beta tests and giveaways</strong> — claim the prize, skip the follow-ups.</li>
          <li><strong>Testing your own product</strong> — developers and QA teams use disposable inboxes to test signup, password reset and email verification flows.</li>
          <li><strong>Protecting against future breaches</strong> — if a site you used gets hacked next year, your real address won't appear in the dump.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">When a temporary email is <em>not</em> the right tool</h2>
        <p className="mt-3 leading-relaxed">
          A disposable inbox is the wrong choice anywhere you actually want to keep the account long-term. Don't use it for your bank, your tax portal, your government services, your work tools, or any account that holds money, identity documents, or anything you'd be upset to lose access to. The address will expire — and so will your ability to recover the account.
        </p>
        <p className="mt-3 leading-relaxed">
          A small number of websites also explicitly block disposable domains, especially in finance, healthcare and identity verification. That's by design on their side and there's nothing wrong with it; just use your real address in those places.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Is it legal? Is it safe?</h2>
        <p className="mt-3 leading-relaxed">
          Yes, on both counts. Using a disposable email is no different from using any other email address — the only thing changing is which inbox the message lands in. There is no law anywhere that says your email address must contain your real name, must live at a specific provider, or must remain active for any particular length of time. As long as you're not using a temp address to commit fraud, evade a ban, or impersonate someone else, you're well within your rights.
        </p>
        <p className="mt-3 leading-relaxed">
          On the safety side, temporary email is generally <em>safer</em> than your real inbox for one-off use, because it removes the long-term trail. Just keep in mind that temporary inboxes are not encrypted private vaults — they're public-by-design throwaway addresses. Don't have anything truly sensitive sent to one (passwords for important accounts, two-factor backup codes for critical services, legal documents, etc.). For everything else, it's perfect.
        </p>

        <h2 className="mt-10 text-2xl font-semibold tracking-tight">Why MyTempMail</h2>
        <p className="mt-3 leading-relaxed">
          MyTempMail keeps the idea simple. One click and you have an address. Messages appear in real time, no refresh button required. The same inbox is visible across every browser tab you open. If you want a memorable address, pick a custom name. If you want it gone, hit Delete. If you forget about it, it'll clean itself up.
        </p>
        <p className="mt-3 leading-relaxed">
          No accounts. No tracking pixels in your inbox. No "upgrade to premium" walls. Just a small, fast, free tool that does exactly one thing well — gives your real inbox a quiet day.
        </p>

        <div className="mt-10 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary/5 p-6 text-center sm:p-8">
          <h3 className="text-xl font-semibold">Try it now</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Get a working disposable inbox in one click. No signup, no questions asked.
          </p>
          <Link
            to="/"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Generate a temp email
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
