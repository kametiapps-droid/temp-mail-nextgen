import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
      )}
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      )}
      {children && <div className="mt-12">{children}</div>}
    </main>
  );
}

export function ComingSoon({ note }: { note?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <p className="text-sm text-muted-foreground">
        {note || "Content coming soon."}
      </p>
    </div>
  );
}
