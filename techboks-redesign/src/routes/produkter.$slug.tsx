import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Check, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Model3DViewer } from "@/components/Model3DViewer";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import {
  CATEGORY_PATHS,
  formatPrice,
  getCategory,
  getProductByVariantSlug,
  getRelatedProducts,
  products,
  type Product,
} from "@/data/products";
import { useCart } from "@/lib/cart";
import { OG_IMAGES, IMAGE_SIZES } from "@/data/imageSizes";
import { pageHead } from "@/seo/head";
import { breadcrumbList, productNode, productPath, webPage } from "@/seo/schema";
import { absoluteUrl } from "@/seo/site";

/** Produktets eget 1200×630-billede, ellers dets første foto. */
function productOgImage(product: Product) {
  const alt = `${product.name} fra TechBoks`;
  if (OG_IMAGES.has(product.slug)) {
    return { src: `/images/og/${product.slug}.jpg`, alt, width: 1200, height: 630 };
  }
  const src = product.images[0]!;
  const size = IMAGE_SIZES[src] ?? { w: 1200, h: 900 };
  return { src, alt, width: size.w, height: size.h };
}

/**
 * Kun Center Konsol Boks afhænger af årgangen (den har et "Årgang"-valg). Alt
 * andet Mach-E-tilbehør passer til alle årgange — bekræftet af ejeren.
 */
function specificationsWithFit(product: Product) {
  const hasYearChoice = product.options?.some((o) => o.label === "Årgang");
  if (product.category !== "mustang-mach-e" || hasYearChoice) return product.specifications;
  return [...product.specifications, { label: "Årgange", value: "Alle årgange af Mustang Mach-E" }];
}

export const Route = createFileRoute("/produkter/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (product) return { product };
    // Left/right versions had their own pages for a while (Sept 2026) — send
    // those links to the combined product instead of a 404.
    const combined = getProductByVariantSlug(params.slug);
    if (combined) {
      throw redirect({ to: "/produkter/$slug", params: { slug: combined.slug }, statusCode: 301 });
    }
    throw notFound();
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Produktet findes ikke | TechBoks" },
          { name: "robots", content: "noindex, follow" },
        ],
      };
    }
    const { product } = loaderData;
    const path = productPath(product);
    const category = getCategory(product.category);
    return pageHead({
      path,
      title: product.seoTitle,
      description: product.seoDescription,
      ogType: "product",
      image: productOgImage(product),
      graph: [
        webPage({
          path,
          title: product.seoTitle,
          description: product.seoDescription,
          type: "ItemPage",
          image: product.images[0],
          breadcrumb: true,
          mainEntity: `${absoluteUrl(path)}#product`,
        }),
        breadcrumbList(path, [
          { name: "Forside", path: "/" },
          { name: category?.name ?? "Produkter", path: CATEGORY_PATHS[product.category] },
          { name: product.name, path },
        ]),
        productNode(product),
      ],
    });
  },
  component: ProductDetailRoute,
  errorComponent: ({ error }) => (
    <div className="container-tb py-24" role="alert">
      {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-tb py-24 text-center">
      <h1 className="text-2xl font-semibold text-ink">Produktet findes ikke</h1>
      <Link to="/produkter" search={{ kategori: "alle", q: "" }} className="mt-4 inline-block text-sm underline">
        Se alle produkter
      </Link>
    </div>
  ),
});

function ProductDetailRoute() {
  const { product } = Route.useLoaderData();
  // Keyed so choices made on one product don't carry over when navigating to
  // another (e.g. via "Relaterede produkter").
  return <ProductDetail key={product.id} product={product} />;
}

function ProductDetail({ product }: { product: Product }) {
  const category = getCategory(product.category);
  const related = getRelatedProducts(product);
  const { add } = useCart();
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (product.options ?? []).filter((o) => !o.required).map((o) => [o.label, o.values[0]!]),
    ),
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // A required option (left/right) has no default, so nothing goes in the cart
  // until the customer has actively picked one.
  const missingOption = product.options?.find((o) => !selections[o.label]);

  const variant = product.options?.length
    ? product.options.map((o) => selections[o.label]).join(" · ")
    : undefined;

  // What the current selection points at — today only the centre console box
  // uses these, to show the fit for the chosen model year. First option that
  // maps its selected value wins.
  const selectedAsset = (key: "imageByValue" | "modelByValue") =>
    product.options?.reduce<string | undefined>(
      (found, option) => found ?? option[key]?.[selections[option.label] ?? ""],
      undefined,
    );

  const focusImage = selectedAsset("imageByValue");
  const modelPath = selectedAsset("modelByValue") ?? product.modelPath;

  const handleAdd = () => {
    if (missingOption) return;
    add(product.id, quantity, variant, selections);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container-tb py-10 lg:py-14">
      <Breadcrumbs
        items={[
          { name: "Forside", to: "/" },
          { name: category?.name ?? "Produkter", to: CATEGORY_PATHS[product.category] },
          { name: product.name },
        ]}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* min-w-0: grid items default to min-width:auto, which lets the
            content push the column past the viewport on narrow screens. */}
        <div className="min-w-0">
          <ProductGallery images={product.images} alt={product.name} focus={focusImage} />
          {modelPath && (
            <Model3DViewer
              src={modelPath}
              rotation={product.slug === "slaebekrog-daeksel" ? [Math.PI, 0, 0] : undefined}
              className="mt-3 aspect-[4/3] w-full"
            />
          )}
        </div>

        <div className="bg-surface rounded-blob-lg min-w-0 p-7 sm:p-9">
          <span className="eyebrow">{category?.name}</span>
          <h1 className="display-lg text-ink mt-3">{product.name}</h1>
          <p className="font-display text-ink mt-4 text-2xl font-semibold">
            {formatPrice(product.price)}
          </p>
          <p className="text-muted-foreground mt-6 text-base leading-relaxed">
            {product.description}
          </p>

          {/* Cross-link to the product this one belongs with (box ↔ add-on). */}
          {product.relatedLink && (
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">
              {product.relatedLink.text}{" "}
              <Link
                to="/produkter/$slug"
                params={{ slug: product.relatedLink.slug }}
                className="text-ink font-medium underline underline-offset-4 hover:no-underline"
              >
                {product.relatedLink.linkLabel}
              </Link>
            </p>
          )}

          {product.options?.map((option) => (
            <div key={option.label} className="mt-8">
              <h2 className="eyebrow">{option.label}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {option.values.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selections[option.label] === value}
                    onClick={() => setSelections((s) => ({ ...s, [option.label]: value }))}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      selections[option.label] === value
                        ? "border-ink bg-ink text-primary-foreground"
                        : "border-border bg-surface text-muted-foreground hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center rounded-full border border-border bg-surface">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Færre"
                className="grid h-12 w-11 place-items-center text-muted-foreground hover:text-ink"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-ink">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Flere"
                className="grid h-12 w-11 place-items-center text-muted-foreground hover:text-ink"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!!missingOption}
              className="inline-flex h-12 flex-1 min-w-48 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-primary-foreground transition-opacity enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Lagt i kurven
                </>
              ) : missingOption ? (
                `Vælg ${missingOption.label.toLowerCase()} først`
              ) : (
                "Læg i kurv"
              )}
            </button>
          </div>


          <div className="rounded-blob bg-canvas mt-10 overflow-hidden">
            <h2 className="eyebrow border-ink/10 border-b px-5 py-3.5">Specifikationer</h2>
            <dl className="divide-ink/10 divide-y">
              {specificationsWithFit(product).map((spec) => (
                <div key={spec.label} className="grid grid-cols-[9rem_1fr] gap-4 px-5 py-3.5">
                  <dt className="text-muted-foreground text-sm">{spec.label}</dt>
                  <dd className="text-ink text-sm font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="display-lg text-ink">Relaterede produkter</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
