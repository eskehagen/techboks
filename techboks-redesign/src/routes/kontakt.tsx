import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Instagram, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Reveal } from "@/components/Reveal";
import { submitContactMessage } from "@/lib/contact";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt TechBoks — skriv, bestil eller hent i Aarhus N" },
      {
        name: "description",
        content:
          "Kontakt TechBoks om bestilling, specialønsker eller levering. Skriv via formularen, Messenger eller Instagram — svar inden for 24 timer.",
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
    icon: MessageCircle,
    label: "Messenger",
    text: "Send en Messenger besked",
    href: "https://www.facebook.com/messages/t/eskehagen",
    cta: "Åbn Messenger",
  },
  {
    icon: Instagram,
    label: "Instagram",
    text: "Send en Instagram besked",
    href: "https://www.instagram.com/3design_by_eske",
    cta: "Åbn Instagram",
  },
];

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
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    setStatus("sending");
    setErrorMessage(null);
    try {
      await submitContactMessage({ ...parsed.data, botField });
      setStatus("done");
    } catch (error) {
      setStatus("idle");
      setErrorMessage(
        error instanceof Error ? error.message : "Kunne ikke sende beskeden. Prøv igen senere.",
      );
    }
  };

  return (
    <div className="px-3 pb-20">
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
            Lad os få dit
            <br />
            print på vej
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-canvas/60 mt-6 max-w-xl text-base leading-relaxed"
          >
            Ønsker du at købe nogle af mine produkter — eller har du et specialønske? Skriv en
            besked, så vender jeg tilbage inden for 24 timer.
          </motion.p>
        </div>
      </section>

      {/* Channels */}
      <section className="mx-auto mt-3 grid max-w-[92rem] gap-3 md:grid-cols-3">
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
              Ordre kan sendes med GLS / PostNord — eller afhentes i Aarhus N.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Form + info */}
      <section className="mx-auto mt-3 grid max-w-[92rem] gap-3 lg:grid-cols-[1.3fr_1fr]">
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
                    disabled={status === "sending"}
                    className="bg-ink text-canvas inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold transition-transform hover:scale-[1.03] disabled:scale-100 disabled:opacity-40"
                  >
                    {status === "sending" ? "Sender…" : "Send besked"}
                  </button>
                  {errorMessage && (
                    <p className="text-destructive mt-3 text-sm">{errorMessage}</p>
                  )}
                </div>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-blob-lg bg-ink text-canvas h-full p-7 sm:p-10">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Bestilling
            </h2>
            <div className="text-canvas/65 mt-6 space-y-4 text-sm leading-relaxed">
              <p>
                For bestilling kontakter du mig via formularen eller Messenger. Skriv hvilke
                produkter du ønsker at bestille, samt eventuelle specialønsker.
              </p>
              <p>
                Det er muligt at få tilsendt bestillingen eller afhente den i Aarhus N. Betaling
                sker via MobilePay, når ordren er bekræftet.
              </p>
              <p>Jeg bestræber mig på at besvare alle henvendelser inden for 24 timer.</p>
            </div>
            <Link
              to="/handelsbetingelser"
              className="bg-canvas text-ink mt-8 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform hover:scale-[1.03]"
            >
              Se handelsbetingelser
              <ArrowUpRight className="h-4 w-4" />
            </Link>
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
