import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { z } from "zod";
import { LegalList, TextLink } from "@/components/LegalPage";
import { WITHDRAWAL_BUTTON_LABEL, WITHDRAWAL_LINK_LABEL, submitWithdrawal } from "@/lib/withdrawal";
import { pageHead } from "@/seo/head";
import { SITE } from "@/seo/site";

/**
 * Fortrydelsesfunktionen (forbrugeraftaleloven § 20 a). Se src/lib/withdrawal.ts.
 *
 * Linket »Fortryd aftale« står i footeren på alle sider, i handelsbetingelserne
 * og i ordrebekræftelsen. Siden må ikke gemmes væk bag animationer eller login.
 */
export const Route = createFileRoute("/fortryd")({
  head: () =>
    pageHead({
      path: "/fortryd",
      title: "Fortryd aftale | TechBoks",
      description:
        "Fortryd dit køb hos TechBoks: udfyld navn, e-mail og ordrenummer, tryk »Bekræft fortrydelse«, og få straks en kvittering på mail.",
      noindex: true,
    }),
  component: WithdrawalPage,
});

const withdrawalSchema = z.object({
  name: z.string().trim().min(1, "Skriv dit navn").max(100, "Navnet er for langt"),
  email: z.string().trim().email("Skriv en gyldig e-mail").max(150, "E-mailen er for lang"),
  orderRef: z
    .string()
    .trim()
    .min(1, "Skriv ordrenummeret eller datoen for din bestilling")
    .max(100, "Teksten er for lang"),
  items: z.string().trim().max(1000, "Teksten er for lang"),
});

type Field = keyof z.infer<typeof withdrawalSchema>;

function WithdrawalPage() {
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    orderRef: "",
    items: "",
  });
  const [botField, setBotField] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "failed" | "done">("idle");
  const [receipt, setReceipt] = useState<{ receivedAt: string; email: string } | null>(null);
  const isPending = status === "sending";

  const set = (field: Field) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = withdrawalSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setStatus("sending");
    try {
      const result = await submitWithdrawal({ ...parsed.data, botField });
      setReceipt({ receivedAt: result.receivedAt, email: parsed.data.email });
      setStatus("done");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <div className="px-3 pb-20">
      <section className="rounded-blob-lg bg-ink text-canvas relative mt-3 overflow-hidden px-6 py-16 sm:px-12 sm:py-24">
        <div className="relative max-w-3xl">
          <span className="text-canvas/50 text-[11px] tracking-[0.25em] uppercase">
            {WITHDRAWAL_LINK_LABEL}
          </span>
          <h1 className="font-display mt-5 text-4xl leading-[1.02] font-semibold tracking-tight sm:text-6xl">
            Fortryd dit køb
          </h1>
          <p className="text-canvas/60 mt-6 max-w-xl text-base leading-relaxed">
            Du har 14 dages fortrydelsesret fra den dag, du modtager eller henter varen. Udfyld
            formularen, og tryk »{WITHDRAWAL_BUTTON_LABEL}«. Så får du straks en kvittering på mail.
          </p>
        </div>
      </section>

      <div className="mx-auto mt-3 max-w-[70rem] space-y-3">
        <section className="rounded-blob-lg bg-surface p-7 sm:p-10">
          <h2 className="font-display text-ink text-2xl font-semibold tracking-tight sm:text-3xl">
            {status === "done" ? "Din fortrydelse er modtaget" : "Dine oplysninger"}
          </h2>

          {status === "done" && receipt ? (
            <div role="status" className="bg-canvas rounded-blob mt-6 flex items-start gap-4 p-6">
              <span className="bg-accent-mint text-accent-mint-foreground grid h-10 w-10 shrink-0 place-items-center rounded-full">
                <Check className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="text-muted-foreground text-sm leading-relaxed">
                <p className="text-ink font-semibold">
                  {SITE.name} modtog din fortrydelse den {receipt.receivedAt}.
                </p>
                <p className="mt-1">
                  Kvitteringen er sendt til {receipt.email} med det, du har skrevet, og tidspunktet.
                  Kan du ikke finde den, så kig i spam-mappen.
                </p>
                <p className="mt-1">
                  Hvordan du sender varen retur, står herunder og i kvitteringen.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="botField"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />
              <TextField
                label="Navn"
                autoComplete="name"
                value={values.name}
                onChange={set("name")}
                error={errors.name}
              />
              <TextField
                label="E-mail"
                type="email"
                autoComplete="email"
                hint="Kvitteringen sendes hertil."
                value={values.email}
                onChange={set("email")}
                error={errors.email}
              />
              <div className="sm:col-span-2">
                <TextField
                  label="Ordrenummer"
                  hint="Står i ordrebekræftelsen, fx ORD-215. Kan du ikke finde det, så skriv datoen for din bestilling."
                  value={values.orderRef}
                  onChange={set("orderRef")}
                  error={errors.orderRef}
                />
              </div>
              <div className="sm:col-span-2">
                <TextField
                  label="Hvilke varer vil du fortryde? (valgfrit)"
                  hint="Lad feltet stå tomt, hvis du fortryder hele ordren."
                  textarea
                  value={values.items}
                  onChange={set("items")}
                  error={errors.items}
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-ink text-canvas relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full px-7 text-sm font-semibold transition-transform hover:scale-[1.03] disabled:scale-100 disabled:opacity-40 disabled:hover:scale-100"
                >
                  <span className="relative">{WITHDRAWAL_BUTTON_LABEL}</span>
                  {isPending && (
                    <Loader2 className="relative h-4 w-4 animate-spin" aria-hidden="true" />
                  )}
                </button>
                <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
                  Når du trykker »{WITHDRAWAL_BUTTON_LABEL}«, har du givet {SITE.name} besked om, at
                  du fortryder. Dine oplysninger behandles som beskrevet i{" "}
                  <TextLink to="/privatlivspolitik" newTab>
                    privatlivspolitikken
                  </TextLink>
                  .
                </p>
                <AnimatePresence>
                  {status === "failed" && (
                    <motion.p
                      initial={{ opacity: 0, y: -6, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      role="alert"
                      className="text-destructive mt-3 text-sm leading-relaxed"
                    >
                      Fortrydelsen blev ikke sendt. Prøv igen om lidt, eller skriv til mig via{" "}
                      <TextLink to="/kontakt" newTab>
                        kontaktsiden
                      </TextLink>
                      . En besked, der er sendt, inden fristen udløber, tæller også som fortrydelse.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          )}
        </section>

        <section className="rounded-blob-lg bg-surface p-7 sm:p-10">
          <h2 className="font-display text-ink text-2xl font-semibold tracking-tight sm:text-3xl">
            Sådan foregår det
          </h2>
          <div className="mt-6">
            <LegalList
              items={[
                `Når du har trykket »${WITHDRAWAL_BUTTON_LABEL}«, har du givet ${SITE.name} besked om, at du fortryder. Du får straks en kvittering på mail med det, du har skrevet, og tidspunktet.`,
                `Har du fået varen, så send den retur senest 14 dage efter, at du har givet besked. Du betaler selv returfragten og skal pakke varen forsvarligt. Bor du i nærheden, kan du i stedet aflevere den i ${SITE.pickup} efter aftale.`,
                `Du får pengene tilbage senest 14 dage efter, at du har givet besked, også den fragt, du betalte for at få varen sendt. ${SITE.name} må vente, til varen er kommet retur, eller du har vist, at den er sendt. Er ordren ikke sendt endnu, bliver den ikke sendt.`,
                <>
                  Varer lavet efter dine egne mål, med din egen tekst eller dit eget design kan ikke
                  fortrydes. Læs mere i{" "}
                  <TextLink to="/handelsbetingelser" hash="fortrydelsesret">
                    handelsbetingelserne
                  </TextLink>
                  .
                </>,
                <>
                  Du kan også fortryde ved at skrive til mig via{" "}
                  <TextLink to="/kontakt">kontaktsiden</TextLink>, inden fristen udløber.
                </>,
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function TextField({
  label,
  hint,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  textarea = false,
}: {
  label: string;
  hint?: string | undefined;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string | undefined;
  type?: string;
  autoComplete?: string | undefined;
  textarea?: boolean;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ");
  const shared = {
    id,
    value,
    onChange,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    className:
      "bg-canvas text-ink placeholder:text-muted-foreground/60 w-full rounded-2xl px-5 py-3.5 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_2px_var(--color-ink)]",
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="text-muted-foreground mb-2 block text-[11px] tracking-[0.18em] uppercase"
      >
        {label}
      </label>
      {textarea ? (
        <textarea rows={4} {...shared} />
      ) : (
        <input type={type} autoComplete={autoComplete} {...shared} />
      )}
      {hint && (
        <p id={hintId} className="text-muted-foreground mt-2 text-xs leading-relaxed">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-destructive mt-2 text-xs font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
