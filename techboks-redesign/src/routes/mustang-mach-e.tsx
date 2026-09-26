import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactCta, OrderSteps } from "@/components/OrderSteps";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { CATEGORY_PATHS, products, type Placement, type Product } from "@/data/products";
import { pageHead } from "@/seo/head";
import { breadcrumbList, productList, webPage } from "@/seo/schema";
import { SITE, absoluteUrl } from "@/seo/site";

const PATH = CATEGORY_PATHS["mustang-mach-e"];
const machE = products.filter((p) => p.category === "mustang-mach-e");
const cheapest = Math.min(...machE.map((p) => p.price));

/** Rækkefølge og tekst for grupperne. Produkternes `placement` bestemmer, hvor de står. */
const GROUPS: { id: Placement | "oevrigt"; title: string; text: string }[] = [
  {
    id: "midterkonsol",
    title: "Midterkonsol og instrumentbræt",
    text: "Opbevaring, der passer ned i midterkonsollen under armlænet og i rummet foran frontskærmen.",
  },
  {
    id: "kabine",
    title: "Kabine og døre",
    text: "Ting, der holder kabinen ryddelig: skraldespand til sidedøren, krog til nakkestøtten og holder til dåser.",
  },
  {
    id: "bagagerum",
    title: "Bagagerum og hattehylde",
    text: "Kroge og skillerum til bagagerummet samt clips og reservekrog til hattehylden.",
  },
  {
    id: "udvendigt",
    title: "Udvendigt og opladning",
    text: "Prop til anhængertrækket, dæksel til slæbekrogens gevind og vægophæng til ladekablet.",
  },
  { id: "oevrigt", title: "Øvrigt", text: "Mere tilbehør til Mustang Mach-E." },
];

const groups = GROUPS.map((g) => ({
  ...g,
  items: machE.filter((p: Product) => (p.placement ?? "oevrigt") === g.id),
})).filter((g) => g.items.length > 0);

const centerConsoleBox = products.find((p) => p.slug === "center-konsol-boks");

export const Route = createFileRoute("/mustang-mach-e")({
  head: () => {
    const title = "Tilbehør til Ford Mustang Mach-E | TechBoks";
    const description = `3D-printet tilbehør til Ford Mustang Mach-E: boks til midterkonsollen, front boks, kroge, skraldespand og ladekabel-ophæng. Printet i Danmark, fra ${cheapest} kr.`;
    return pageHead({
      path: PATH,
      title,
      description,
      graph: [
        webPage({
          path: PATH,
          title,
          description,
          type: "CollectionPage",
          breadcrumb: true,
          mainEntity: `${absoluteUrl(PATH)}#produkter`,
        }),
        breadcrumbList(PATH, [
          { name: "Forside", path: "/" },
          { name: "Mustang Mach-E", path: PATH },
        ]),
        productList(PATH, machE),
      ],
    });
  },
  component: MachEPage,
});

function MachEPage() {
  return (
    <div className="container-tb pt-10 pb-20">
      <Breadcrumbs items={[{ name: "Forside", to: "/" }, { name: "Mustang Mach-E" }]} />

      <header className="mt-8 max-w-3xl">
        <span className="eyebrow">Mustang Mach-E</span>
        <h1 className="font-display text-ink mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Tilbehør til Ford Mustang Mach-E
        </h1>
        {/* Svar-først: det afsnit, søgemaskiner og AI-assistenter citerer. */}
        <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">
          TechBoks laver 3D-printet tilbehør til Ford Mustang Mach-E: opbevaring til
          midterkonsollen og instrumentbrættet, kroge, skraldespand, skillerum og ophæng til
          ladekablet. Alt er designet, målt op efter bilen og printet i små serier i Danmark af{" "}
          {SITE.owner.name}. Priserne starter ved {cheapest} kr., og ordrer sendes med DAO eller GLS
          på {SITE.deliveryTime} eller afhentes i {SITE.pickup}.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Kort fortalt">
          {[
            `${machE.length} produkter`,
            `Fra ${cheapest} kr.`,
            `Levering ${SITE.deliveryTime}`,
            "Printet i Danmark",
            `Afhentning i ${SITE.pickup}`,
          ].map((fact) => (
            <li key={fact} className="bg-surface text-ink rounded-full px-4 py-2 text-sm font-medium">
              {fact}
            </li>
          ))}
        </ul>
      </header>

      {groups.map((group) => (
        <section key={group.id} className="mt-20" aria-labelledby={`gruppe-${group.id}`}>
          <Reveal>
            <h2
              id={`gruppe-${group.id}`}
              className="font-display text-ink text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {group.title}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl text-base leading-relaxed">
              {group.text}
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      ))}

      <section className="mt-24" aria-labelledby="aargange">
        <Reveal>
          <div className="rounded-blob-lg bg-surface p-8 sm:p-12">
            <h2
              id="aargange"
              className="font-display text-ink text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Passer det til min Mach-E?
            </h2>
            <p className="text-muted-foreground mt-4 max-w-3xl text-base leading-relaxed">
              Center Konsol Boks findes i to udgaver, fordi midterkonsollen fik ny form med
              2025-modellen: én til 2021–2024 og én til 2025 og nyere. Vælg årgang på produktsiden.
              Alle andre produkter passer til alle årgange af Mustang Mach-E.
            </p>
            {centerConsoleBox && (
              <Link
                to="/produkter/$slug"
                params={{ slug: centerConsoleBox.slug }}
                className="text-ink link-underline mt-6 inline-block text-sm font-semibold"
              >
                Se Center Konsol Boks →
              </Link>
            )}
          </div>
        </Reveal>
      </section>

      <OrderSteps />
      <ContactCta />
    </div>
  );
}
