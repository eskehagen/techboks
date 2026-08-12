import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Instagram, Loader2, MapPin } from "lucide-react";
import { useCallback, useState } from "react";
import { z } from "zod";
import { ContactProgressOverlay } from "@/components/ContactProgressOverlay";
import { Reveal } from "@/components/Reveal";
import type { SubmitOverlayPhase } from "@/components/SubmitProgressOverlay";
import { submitContactMessage } from "@/lib/contact";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt TechBoks — skriv, bestil eller hent i Aarhus N" },
      {
        name: "description",
        content:
          "Kontakt TechBoks om bestilling, specialønsker eller levering. Skriv via formularen eller Instagram — svar inden for 24 timer.",
      },
      { property: "og:title", content: "Kontakt TechBoks" },
      {
        property: "og:description",
        content: "Skriv til TechBoks om bestilling og specialønsker. Svar inden for 24 timer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Skriv dit navn").max(100, "Navnet er for langt"),
  email: z.string().trim().email("Ugyldig email").max(255),
  phone: z.string().trim().max(40, "Telefonnummeret er for langt"),
  subject: z.string().trim().min(1, "Skriv et emne").max(150, "Emnet er for langt"),
  message: z.string().trim().min(1, "Skriv en besked").max(5000, "Beskeden er for lang"),
});

type Field = keyof z.infer<typeof contactSchema>;

const channels = [
  {
    icon: Instagram,
    label: "Instagram",
    text: "Send en Instagram besked",
    href: "https://www.instagram.com/3design_by_eske",
    cta: "Åbn Instagram",
  },
];

/**
 * Minimum time the sending overlay stays up, so a fast response still reads as
 * a deliberate step rather than a flash.
 */
const MIN_OVERLAY_MS = 1400;

const waitAtLeast = (startedAt: number) => {
  const remaining = MIN_OVERLAY_MS - (Date.now() - startedAt);
  return remaining > 0
    ? new Promise((resolve) => setTimeout(resolve, remaining))
    : Promise.resolve();
};

function ContactPage() {
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [botField, setBotField] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "done">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const overlayPhase: SubmitOverlayPhase | null =
    status === "sending" || status === "success" ? status : null;
  const isPending = overlayPhase !== null;

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    const startedAt = Date.now();
    setStatus("sending");
    setErrorMessage(null);
    try {
      await submitContactMessage({ ...parsed.data, botField });
      await waitAtLeast(startedAt);
      setStatus("success");
    } catch (error) {
      await waitAtLeast(startedAt);
      setStatus("idle");
      setErrorMessage(
        error instanceof Error ? error.message : "Kunne ikke sende beskeden. Prøv igen senere.",
      );
    }
  };

  /** Called by the overlay once its completion beat has played. */
  const showConfirmation = useCallback(() => setStatus("done"), []);

  return (
    <div className="px-3 pb-20">
      <ContactProgressOverlay phase={overlayPhase} onFinished={showConfirmation} />
      {/* Hero */}
      <section className="rounded-blob-lg bg-ink text-canvas relative mt-3 overflow-hidden px-6 py-16 sm:px-12 sm:py-24">
        <motion.div
          aria-hidden
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-accent-mint/25 pointer-events-none absolute -top-40 -right-24 h-[26rem] w-[26rem] rounded-full blur-3xl"
        />
        <div className="relative max-w-3xl">
          <span className="text-canvas/50 text-[11px] tracking-[0.25em] uppercase">Kontakt</span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mt-5 text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl"
          >
            Er du i tvivl om noget
            <br />
            kontakt mig endelig
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-canvas/60 mt-6 max-w-xl text-base leading-relaxed"
          >
            Har du spørgsmål til mine produkter — eller har du et specialønske? Skriv en besked, så
            vender jeg tilbage inden for 24 timer.
          </motion.p>
        </div>
      </section>

      {/* Channels */}
      <section className="mx-auto mt-3 grid max-w-[92rem] gap-3 md:grid-cols-2">
        {channels.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.08}>
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-blob bg-surface group flex h-full flex-col p-7 transition-transform hover:-translate-y-1"
            >
              <span className="bg-canvas text-ink grid h-12 w-12 place-items-center rounded-full">
                <c.icon className="h-5 w-5" />
              </span>
              <h2 className="font-display text-ink mt-6 text-2xl font-semibold tracking-tight">
                {c.label}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">{c.text}</p>
              <span className="text-ink mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
                {c.cta}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </Reveal>
        ))}
        <Reveal delay={0.16}>
          <div className="rounded-blob bg-accent-mint text-accent-mint-foreground flex h-full flex-col p-7">
            <span className="bg-ink text-canvas grid h-12 w-12 place-items-center rounded-full">
              <MapPin className="h-5 w-5" />
            </span>
            <h2 className="font-display mt-6 text-2xl font-semibold tracking-tight">Levering</h2>
            <p className="mt-2 text-sm opacity-80">
              Ordre kan sendes med DAO / GLS — eller afhentes i Aarhus N.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Form */}
      <section className="mx-auto mt-3 max-w-[72rem]">
        <Reveal>
          <div className="rounded-blob-lg bg-surface p-7 sm:p-10">
            <h2 className="font-display text-ink text-3xl font-semibold tracking-tight sm:text-4xl">
              Send mig en besked
            </h2>

            {status === "done" ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-canvas rounded-blob mt-8 flex items-start gap-4 p-6"
              >
                <span className="bg-accent-mint text-accent-mint-foreground grid h-10 w-10 shrink-0 place-items-center rounded-full">
                  <Check className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-ink font-semibold">Tak for din besked!</p>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    Beskeden er sendt. Jeg vender tilbage hurtigst muligt — typisk inden for 24
                    timer.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-4 sm:grid-cols-2">
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
                  value={values.name}
                  onChange={set("name")}
                  error={errors.name}
                />
                <TextField
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={set("email")}
                  error={errors.email}
                />
                <TextField
                  label="Telefon (valgfrit)"
                  type="tel"
                  value={values.phone}
                  onChange={set("phone")}
                  error={errors.phone}
                />
                <TextField
                  label="Emne"
                  value={values.subject}
                  onChange={set("subject")}
                  error={errors.subject}
                />
                <div className="sm:col-span-2">
                  <TextField
                    label="Besked"
                    textarea
                    value={values.message}
                    onChange={set("message")}
                    error={errors.message}
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="bg-ink text-canvas relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full px-7 text-sm font-semibold transition-transform hover:scale-[1.03] disabled:scale-100 disabled:opacity-40 disabled:hover:scale-100"
                  >
                    {isPending && (
                      <motion.span
                        aria-hidden
                        animate={{ x: ["-140%", "260%"] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        className="via-canvas/25 absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent to-transparent"
                      />
                    )}
                    <span className="relative">{isPending ? "Sender besked…" : "Send besked"}</span>
                    {isPending && <Loader2 className="relative h-4 w-4 animate-spin" />}
                  </button>
                  <AnimatePresence>
                    {errorMessage && (
                      <motion.p
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        role="alert"
                        className="text-destructive mt-3 text-sm"
                      >
                        {errorMessage}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  error,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string | undefined;
  type?: string;
  textarea?: boolean;
}) {
  const base =
    "bg-canvas text-ink placeholder:text-muted-foreground/60 w-full rounded-2xl px-5 py-3.5 text-sm outline-none ring-0 transition-shadow focus:shadow-[0_0_0_2px_var(--color-ink)]";
  return (
    <label className="block">
      <span className="text-muted-foreground mb-2 block text-[11px] tracking-[0.18em] uppercase">
        {label}
      </span>
      {textarea ? (
        <textarea rows={6} value={value} onChange={onChange} className={base} />
      ) : (
        <input type={type} value={value} onChange={onChange} className={base} />
      )}
      {error && <span className="text-destructive mt-2 block text-xs font-medium">{error}</span>}
    </label>
  );
}
