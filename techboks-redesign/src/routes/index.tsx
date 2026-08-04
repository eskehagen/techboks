import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, Boxes, Leaf, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import heroAsset from "@/assets/hero-mache.png.asset.json";
import { categories, formatPrice, products } from "@/data/products";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { ScrollText } from "@/components/ScrollText";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TechBoks — Dansk designet 3D print tilbehør" },
      {
        name: "description",
        content:
          "TechBoks designer og 3D printer funktionelt tilbehør i Danmark. Gadgets til Mustang Mach-E og smarte løsninger til hjemmet.",
      },
      { property: "og:title", content: "TechBoks — Dansk designet 3D print tilbehør" },
      {
        property: "og:description",
        content:
          "Funktionelt 3D printet tilbehør, designet og produceret i Danmark. Se produkterne.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});


function Home() {
  return (
    <div className="pb-4">
      <Hero />
      <Manifesto />
      <StackedCategories />
      <ProductStrip />
      <BenefitsSection />
      <ClosingCta />
    </div>
  );
}

/* ── Hero: static hero image with text overlay + fade-out on scroll ── */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const veil = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section className="px-3 pt-3">
      <div
        ref={ref}
        className="bg-surface rounded-blob relative aspect-[3/4] w-full overflow-hidden sm:aspect-[4/3] lg:aspect-[992/541]"
      >

        <img
          src={heroAsset.url}
          alt="Sort Ford Mustang Mach-E i et værksted med 3D printere"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="from-surface via-surface/90 sm:via-surface/70 absolute inset-0 bg-gradient-to-r to-transparent to-85% sm:via-45%" />
        <motion.div
          style={{ opacity: veil }}
          className="bg-canvas pointer-events-none absolute inset-0 z-20"
        />

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative flex h-full flex-col justify-start p-6 pt-10 sm:p-12 lg:p-16"
        >

          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-muted-foreground text-xs tracking-[0.24em] uppercase"
          >
            Designet og printet i Danmark
          </motion.span>

          <h1 className="display-xl text-ink mt-5 max-w-3xl">
            {["Tilbehør der er", "tegnet til at passe."].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block pb-[0.09em]"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed"
          >
            Små serier, præcise mål og funktion før pynt — tegnet fra bunden i vores eget
            værksted.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-7 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/produkter"
              search={{ kategori: "alle", q: "" }}
              className="bg-accent-mint text-accent-mint-foreground group flex h-14 items-center gap-4 rounded-full pr-2 pl-7 text-sm font-semibold text-nowrap transition-transform hover:scale-[1.03]"
            >
              Se produkter
              <span className="bg-ink text-canvas grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <a
              href="#manifest"
              className="border-ink/25 text-ink hover:bg-ink/5 grid h-14 w-14 place-items-center rounded-full border transition-colors"
              aria-label="Scroll ned"
            >
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="h-5 w-5" />
              </motion.span>
            </a>
          </motion.div>
        </motion.div>

      </div>

      {/* Ticker below the hero card */}
      <div className="mt-3">
        <Marquee
          items={[
            "0,2 mm laghøjde",
            "Printet i Danmark",
            "3–7 hverdages levering",
            "Betaling via MobilePay",
            `${products.length}+ produkter`,
            "PETG & PLA",
          ]}
        />
      </div>
    </section>
  );
}



/* ── Manifesto with scroll-driven word reveal ──────────────────────── */
function Manifesto() {
  return (
    <section id="manifest" className="container-tb scroll-mt-28 py-28 sm:py-40">
      <span className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
        Sådan arbejder vi
      </span>
      <ScrollText
        className="display-lg text-ink mt-8 max-w-5xl"
        text="Vi tegner hvert produkt fra bunden, måler op i virkeligheden og printer i små serier — så det passer præcist, holder til hverdagen og ikke ligner noget andet."
      />

      <div className="mt-16 grid gap-3 md:grid-cols-3">
        {[
          [`${products.length}+`, "produkter i katalog", "bg-surface"],
          ["0,2 mm", "laghøjde på hvert print", "bg-clay"],
          ["3–7", "hverdage til din dør", "bg-accent-mint"],
        ].map(([value, label, bg], i) => (
          <Reveal key={label} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`rounded-blob ${bg} text-ink p-8`}
            >
              <p className="font-display text-5xl font-semibold tracking-tight">{value}</p>
              <p className="mt-2 text-sm opacity-70">{label}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Sticky stacked category cards ─────────────────────────────────── */
function StackedCategories() {
  return (
    <section id="katalog" className="container-tb scroll-mt-28">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display-lg text-ink max-w-xl">
            To kategorier.
            <br />
            Én besættelse af detaljer.
          </h2>
          <Link
            to="/produkter"
            search={{ kategori: "alle", q: "" }}
            className="text-ink link-underline text-sm font-medium tracking-wide"
          >
            Se alle produkter →
          </Link>
        </div>
      </Reveal>

      <div className="mt-10 flex flex-col gap-4">
        {categories.map((c, i) => (
          <MergeCard key={c.id} index={i}>
            <Link
              to="/produkter"
              search={{ kategori: c.slug, q: "" }}
              className="rounded-blob-lg bg-surface group grid overflow-hidden lg:grid-cols-2"
            >
              <div className="bg-muted aspect-[16/11] overflow-hidden lg:aspect-auto lg:h-full">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                />
              </div>
              <div className="flex flex-col justify-between gap-8 p-8 sm:p-12">
                <div>
                  <span className="text-muted-foreground text-[11px] tracking-[0.2em] uppercase">
                    {c.tagline}
                  </span>
                  <h3 className="font-display text-ink mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                    {c.name}
                  </h3>
                  <p className="text-muted-foreground mt-5 max-w-sm text-sm leading-relaxed">
                    {c.description}
                  </p>
                </div>
                <span className="bg-ink text-canvas grid h-14 w-14 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          </MergeCard>
        ))}
      </div>
    </section>
  );
}

/** Cards slide in from alternating sides and merge into place while scrolling. */
function MergeCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const dir = index % 2 === 0 ? -1 : 1;
  const x = useTransform(scrollYProgress, [0, 1], [dir * 160, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [dir * 4, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <div ref={ref}>
      <motion.div style={{ x, rotate, scale, opacity }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}


/* ── Small product preview grid ─────────────────────────────────────── */
function ProductStrip() {
  const preview = products.slice(0, 4);

  return (
    <section className="container-tb mt-32">
      <Reveal>
        <span className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
          Et udpluk
        </span>
        <h2 className="display-lg text-ink mt-4 max-w-xl">Rul igennem kataloget</h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {preview.map((p, i) => (
          <FlyInCard key={p.id} index={i} className="lg:col-span-1">
            <Link
              to="/produkter/$slug"
              params={{ slug: p.slug }}
              className="rounded-blob bg-surface group block h-full overflow-hidden"
            >
              <div className="bg-muted aspect-[4/3] overflow-hidden">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-start justify-between gap-4 p-5">
                <div className="min-w-0">
                  <h3 className="font-display text-ink truncate text-lg font-semibold tracking-tight">
                    {p.name}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">{formatPrice(p.price)}</p>
                </div>
                <span className="border-ink/15 text-ink grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </FlyInCard>
        ))}
        <FlyInCard index={4} className="sm:col-span-2 lg:col-span-1">
          <Link
            to="/produkter"
            search={{ kategori: "alle", q: "" }}
            className="bg-accent-mint text-accent-mint-foreground rounded-blob flex h-full min-h-[12rem] flex-col items-start justify-between p-6 transition-transform hover:scale-[1.02]"
          >
            <span className="font-display text-3xl font-semibold tracking-tight">
              Se alle<br />produkter
            </span>
            <span className="border-ink/15 text-ink grid h-10 w-10 place-items-center rounded-full border">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </FlyInCard>
      </div>
    </section>
  );
}

/** Cards fly in from the right with a lively spring motion. */
function FlyInCard({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const x = useTransform(scrollYProgress, [0, 1], [240 + index * 60, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [40 + (index % 2) * 30, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 8 : -6, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ x, y, rotate, scale, opacity }}
        className="h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}


/* ── Why TechBoks — Coda-style stacked cards ─────────────────────────── */
function BenefitsSection() {
  const cards = [
    {
      icon: ShieldCheck,
      title: "Holdbare materialer",
      text: "Vi printer i PETG og tekniske filamenter, der tåler varme, vibrationer og daglig brug.",
      bg: "bg-ink",
      textColor: "text-canvas",
      accent: "bg-accent-mint",
      accentIcon: "text-accent-mint-foreground",
      ring: "ring-canvas/10",
    },
    {
      icon: Leaf,
      title: "Grøn produktion",
      text: "Bionedbrydeligt plast og grøn strøm. Små serier betyder minimalt spild.",
      bg: "bg-accent-mint",
      textColor: "text-accent-mint-foreground",
      accent: "bg-ink",
      accentIcon: "text-canvas",
      ring: "ring-accent-mint-foreground/20",
    },
    {
      icon: Boxes,
      title: "Personlig service",
      text: "Farver, mål og detaljer kan tilpasses. Skriv til os — der sidder et menneske i den anden ende.",
      bg: "bg-clay",
      textColor: "text-ink",
      accent: "bg-ink",
      accentIcon: "text-canvas",
      ring: "ring-ink/10",
    },
  ];

  return (
    <section className="container-tb mt-32">
      <div className="rounded-blob-lg bg-ink text-canvas overflow-hidden p-10 sm:p-16 lg:p-24">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-canvas/50 text-xs tracking-[0.24em] uppercase">
              Hvorfor TechBoks
            </span>
            <h2 className="display-lg mt-6">Håndværk, ikke masseproduktion</h2>
            <p className="text-canvas/60 mt-4 text-base leading-relaxed">
              Vi designer, måler og printer hver detalje selv — så du får reservedele og gadgets der
              holder.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((b, i) => (
            <FanCard
              key={b.title}
              index={i}
              className={i === 1 ? "sm:col-span-2 lg:col-span-1" : ""}
            >
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
                className={`${b.bg} ${b.textColor} rounded-blob-lg relative h-full min-h-[22rem] p-7 ring-1 ${b.ring} sm:p-8`}
              >
                <div
                  className={`${b.accent} ${b.accentIcon} grid h-12 w-12 place-items-center rounded-full`}
                >
                  <b.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-display mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {b.title}
                </h3>
                <p className={`mt-4 text-sm leading-relaxed opacity-70`}>{b.text}</p>

                <div className="absolute top-6 right-6 h-2 w-2 rounded-full bg-current opacity-20" />
                <div className="absolute right-10 bottom-10 h-16 w-16 rounded-full bg-current opacity-[0.03]" />
              </motion.div>
            </FanCard>
          ))}
        </div>

      </div>
    </section>
  );
}

/** Cards fan in from a spread-out deck and align while scrolling. */
function FanCard({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const offset = index - 1;
  const x = useTransform(scrollYProgress, [0, 1], [offset * -90, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [80 + Math.abs(offset) * 40, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [offset * 7, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0.05, 0.55], [0, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ x, y, rotate, scale, opacity }}
        className="h-full origin-bottom will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}


/* ── Closing CTA ───────────────────────────────────────────────────── */
function ClosingCta() {
  return (
    <section className="container-tb mt-3">
      <Reveal>
        <div className="rounded-blob-lg bg-accent-mint text-accent-mint-foreground flex flex-wrap items-center justify-between gap-6 p-10 sm:p-16">
          <h2 className="display-lg max-w-xl">Klar til at rydde op i bilen?</h2>
          <Link
            to="/produkter"
            search={{ kategori: "alle", q: "" }}
            className="bg-ink text-canvas group flex h-14 items-center gap-4 rounded-full pr-2 pl-7 text-sm font-semibold"
          >
            Gå til kataloget
            <span className="bg-accent-mint text-accent-mint-foreground grid h-10 w-10 place-items-center rounded-full transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
