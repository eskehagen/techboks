import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactCta, OrderSteps } from "@/components/OrderSteps";
import { ProductGrid } from "@/components/ProductGrid";
import { Reveal } from "@/components/Reveal";
import { CATEGORY_PATHS, products } from "@/data/products";
import { pageHead } from "@/seo/head";
import { breadcrumbList, productList, webPage } from "@/seo/schema";
import { SITE, absoluteUrl } from "@/seo/site";

const PATH = CATEGORY_PATHS["mustang-mach-e"];
const machE = products.filter((p) => p.category === "mustang-mach-e");
const cheapest = Math.min(...machE.map((p) => p.price));

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

      {/* Alle Mach-E-produkter i én liste, i samme rækkefølge som i produktdata. */}
      <div className="mt-12">
        <ProductGrid products={machE} />
      </div>

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
