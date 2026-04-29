import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  const cols = [
    {
      title: t("footer.groups.product"),
      links: [
        { to: "/features", label: t("footer.links.features") },
        { to: "/how-it-works", label: t("footer.links.howItWorks") },
        { to: "/use-cases", label: t("footer.links.useCases") },
      ],
    },
    {
      title: t("footer.groups.tempMailFor"),
      links: [
        { to: "/free-temporary-email-generator", label: t("footer.links.freeGenerator") },
        { to: "/disposable-email-for-verification", label: t("footer.links.verification") },
        { to: "/temp-mail-for-otp", label: t("footer.links.otp") },
        { to: "/temp-mail-for-instagram", label: t("footer.links.instagram") },
        { to: "/temp-mail-for-netflix", label: t("footer.links.netflix") },
        { to: "/temp-mail-for-amazon", label: t("footer.links.amazon") },
        { to: "/temp-mail-for-tiktok", label: t("footer.links.tiktok") },
      ],
    },
    {
      title: t("footer.groups.resources"),
      links: [
        { to: "/blog", label: t("footer.links.blog") },
        { to: "/faq", label: t("footer.links.faq") },
        { to: "/what-is-temporary-email", label: t("footer.links.whatIs") },
      ],
    },
    {
      title: t("footer.groups.company"),
      links: [
        { to: "/about", label: t("footer.links.about") },
        { to: "/contact", label: t("footer.links.contact") },
        { to: "/privacy-policy", label: t("footer.links.privacy") },
        { to: "/terms-of-service", label: t("footer.links.terms") },
        { to: "/disclaimer", label: t("footer.links.disclaimer") },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 md:grid-cols-5">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>
            </span>
            MyTempMail
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="text-sm font-semibold">{c.title}</h4>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} MyTempMail. {t("footer.rights")}</p>
          <p>{t("footer.madeFor")}</p>
        </div>
      </div>
    </footer>
  );
}
