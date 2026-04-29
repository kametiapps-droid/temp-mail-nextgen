import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES, applyLanguageSideEffects } from "../lib/i18n";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", () => setOpen(false), { passive: true, once: true });
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0];

  const change = (code: string) => {
    i18n.changeLanguage(code);
    applyLanguageSideEffects(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("language.label")}
        title={t("language.label")}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden font-medium sm:inline">{current.code.toUpperCase()}</span>
      </button>
      {open && (
        <div className="absolute end-0 z-50 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
          <ul className="max-h-72 overflow-y-auto py-1">
            {SUPPORTED_LANGUAGES.map((l) => {
              const active = l.code === current.code;
              return (
                <li key={l.code}>
                  <button
                    onClick={() => change(l.code)}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{l.nativeLabel}</span>
                      <span className="text-xs text-muted-foreground/70">{l.label}</span>
                    </span>
                    {active && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
