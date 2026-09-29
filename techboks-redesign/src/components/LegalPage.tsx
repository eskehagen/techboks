import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Fælles opbygning af de juridiske sider (/handelsbetingelser og
 * /privatlivspolitik): mørk hero, kort med én overskrift hver og et
 * kontaktkort nederst.
 */

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  children,
  contactText,
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  /** Vises under introen, fx "28. september 2026". */
  updated: string;
  children: ReactNode;
  contactText: string;
}) {
  return (
    <div className="px-3 pb-20">
      <section className="rounded-blob-lg bg-ink text-canvas relative mt-3 overflow-hidden px-6 py-16 sm:px-12 sm:py-24">
        <div className="relative max-w-3xl">
          <span className="text-canvas/50 text-[11px] tracking-[0.25em] uppercase">{eyebrow}</span>
          <h1 className="font-display mt-5 text-4xl leading-[1.02] font-semibold tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="text-canvas/60 mt-6 max-w-xl text-base leading-relaxed">{intro}</p>
          <p className="text-canvas/60 mt-4 text-xs">Senest opdateret {updated}.</p>
        </div>
      </section>

      <div className="mx-auto mt-3 max-w-[70rem] space-y-3">{children}</div>

      <section className="mx-auto mt-3 max-w-[70rem]">
        <Reveal>
          <div className="rounded-blob-lg bg-ink text-canvas p-7 text-center sm:p-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Har du spørgsmål?
            </h2>
            <p className="text-canvas/65 mx-auto mt-3 max-w-md text-sm leading-relaxed">
              {contactText}
            </p>
            <Link
              to="/kontakt"
              className="bg-canvas text-ink mt-6 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform hover:scale-[1.03]"
            >
              Gå til kontakt
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

/** Ét kort med en h2. `id` giver et anker, fx /handelsbetingelser#fortrydelsesret. */
export function LegalSection({
  id,
  title,
  index = 0,
  children,
}: {
  id?: string;
  title: string;
  index?: number;
  children: ReactNode;
}) {
  return (
    <Reveal delay={Math.min(index * 0.04, 0.3)}>
      <section id={id} className="rounded-blob-lg bg-surface scroll-mt-28 p-7 sm:p-10">
        <h2 className="font-display text-ink text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <div className="mt-6 space-y-5">{children}</div>
      </section>
    </Reveal>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="text-muted-foreground flex gap-3 text-sm leading-relaxed">
          <Check
            aria-hidden="true"
            className="text-accent-mint-foreground mt-0.5 h-4 w-4 shrink-0"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Almindeligt afsnit inde i et kort. */
export function LegalText({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>;
}

/** Mindre overskrift inde i et kort. */
export function LegalSubheading({ children }: { children: ReactNode }) {
  return <h3 className="font-display text-ink text-lg font-semibold tracking-tight">{children}</h3>;
}

/** Nøgle/værdi-par, fx Oplysninger / Formål / Retsgrundlag / Opbevaring. */
export function LegalFacts({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="bg-canvas divide-ink/10 divide-y rounded-3xl px-5 sm:px-6">
      {rows.map((row) => (
        <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[9.5rem_1fr] sm:gap-6">
          <dt className="text-ink text-xs font-semibold tracking-[0.12em] uppercase sm:pt-0.5">
            {row.label}
          </dt>
          <dd className="text-muted-foreground text-sm leading-relaxed">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Link inde i brødtekst: altid understreget, så det kan ses uden hover.
 * `newTab` bruges under formularer, så det, kunden har skrevet, ikke går tabt.
 */
export function TextLink({
  to,
  hash,
  newTab = false,
  children,
}: {
  to: "/kontakt" | "/handelsbetingelser" | "/privatlivspolitik" | "/fortryd";
  hash?: string;
  newTab?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      {...(hash ? { hash } : {})}
      {...(newTab ? { target: "_blank", rel: "noopener" } : {})}
      className="text-ink decoration-ink/30 hover:decoration-ink font-medium underline underline-offset-2 transition-colors"
    >
      {children}
      {newTab && <span className="sr-only"> (åbner i en ny fane)</span>}
    </Link>
  );
}

/** Link til et andet website, fx Datatilsynet. */
export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-ink decoration-ink/30 hover:decoration-ink font-medium underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  );
}
