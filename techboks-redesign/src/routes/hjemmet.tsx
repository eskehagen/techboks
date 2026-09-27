import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactCta, OrderSteps } from "@/components/OrderSteps";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { CATEGORY_PATHS, getCategory, products } from "@/data/products";
import { pageHead } from "@/seo/head";
import { breadcrumbList, productList, webPage } from "@/seo/schema";
import { absoluteUrl } from "@/seo/site";

const PATH = CATEGORY_PATHS.hjemmet;
const category = getCategory("hjemmet");
const home = products.filter((p) => p.category === "hjemmet");
const homeyCover = home.find((p) => p.slug === "homey-pro-cover");

/** "a, b og c" */
const listDa = (values: string[]) =>
  values.length < 2 ? (values[0] ?? "") : `${values.slice(0, -1).join(", ")} og ${values.at(-1)}`;

export const Route = createFileRoute("/hjemmet")({
  head: () => {
    const title = "Smarte løsninger til hjemmet, 3D-printet | TechBoks";
    const description =
      "3D-printede løsninger til hjemmet fra TechBoks, blandt andet et ventileret cover til Homey Pro 2023 og 2026. Vælg farve og mønster. Printet i Danmark.";
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
          { name: "Hjemmet", path: PATH },
        ]),
        productList(PATH, home),
      ],
    });
  },
  component: HomePage,
});

function HomePage() {
  const colors = homeyCover?.options?.find((o) => o.label === "Farve")?.values ?? [];
  const patterns = homeyCover?.options?.find((o) => o.label === "Mønster")?.values ?? [];

  return (
    <div className="container-tb pt-10 pb-20">
      <Breadcrumbs items={[{ name: "Forside", to: "/" }, { name: "Hjemmet" }]} />

      <header className="mt-8 max-w-3xl">
        <span className="eyebrow">{category?.tagline ?? "Hjemmet"}</span>
        <h1 className="font-display text-ink mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Smarte løsninger til hjemmet
        </h1>
      </header>

      <section className="mt-16" aria-labelledby="produkter-hjemmet">
        <h2
          id="produkter-hjemmet"
          className="font-display text-ink text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Produkter til hjemmet
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {home.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {homeyCover && colors.length > 0 && (
        <section className="mt-24" aria-labelledby="farver">
          <Reveal>
            <div className="rounded-blob-lg bg-surface p-8 sm:p-12">
              <h2
                id="farver"
                className="font-display text-ink text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Farver og mønstre
              </h2>
              <p className="text-muted-foreground mt-4 max-w-3xl text-base leading-relaxed">
                {homeyCover.name} fås i {listDa(colors.map((c) => c.toLowerCase()))}
                {patterns.length > 0 && <> og med mønstrene {listDa(patterns)}</>}. Du vælger på
                produktsiden, før du lægger coveret i kurven.
              </p>
            </div>
          </Reveal>
        </section>
      )}

      <OrderSteps />
      <ContactCta />
    </div>
  );
}
