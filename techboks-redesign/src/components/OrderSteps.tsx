import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/seo/site";
import { Reveal } from "./Reveal";

const steps = [
  {
    title: "Vælg og læg i kurven",
    text: "Vælg farve og de andre muligheder på produktsiden, og læg produktet i kurven.",
  },
  {
    title: "Send din bestilling",
    text: `Udfyld dine oplysninger, og vælg forsendelse eller afhentning i ${SITE.pickup}. Der er ingen online betaling.`,
  },
  {
    title: "Få bekræftelsen og betal",
    text: `Du får straks en ordrebekræftelse på mail med pris inkl. fragt. Betal med ${SITE.payment}. Leveringstiden er ${SITE.deliveryTime}.`,
  },
];

/** "Sådan bestiller du" — the same three steps on every category page. */
export function OrderSteps() {
  return (
    <section className="mt-24" aria-labelledby="bestilling">
      <Reveal>
        <h2
          id="bestilling"
          className="font-display text-ink text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Sådan bestiller du
        </h2>
      </Reveal>
      <ol className="mt-8 grid gap-3 md:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="rounded-blob bg-surface text-ink p-8">
            <span className="font-display text-5xl font-semibold tracking-tight">{i + 1}</span>
            <h3 className="font-display mt-4 text-xl font-semibold tracking-tight">{step.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Closing call to action: special requests → contact, with the FAQ as a second way in. */
export function ContactCta({ showFaq = true }: { showFaq?: boolean }) {
  return (
    <section className="mt-16">
      <Reveal>
        <div className="rounded-blob-lg bg-accent-mint text-accent-mint-foreground flex flex-wrap items-center justify-between gap-6 p-10 sm:p-16">
          <div className="max-w-xl">
            <h2 className="display-lg">Har du et specialønske?</h2>
            <p className="mt-4 text-base leading-relaxed">
              Farver, mål og detaljer kan tilpasses. Skriv til mig, så vender jeg tilbage inden for
              24 timer.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/kontakt"
              className="bg-ink text-canvas group flex h-14 items-center gap-4 rounded-full pr-2 pl-7 text-sm font-semibold"
            >
              Kontakt mig
              <span className="bg-accent-mint text-accent-mint-foreground grid h-10 w-10 place-items-center rounded-full transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
            {showFaq && (
              <Link
                to="/faq"
                className="border-ink/25 flex h-14 items-center rounded-full border px-7 text-sm font-semibold"
              >
                Spørgsmål og svar
              </Link>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
