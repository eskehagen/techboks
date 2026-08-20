import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Model3DViewer } from "@/components/Model3DViewer";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import {
  formatPrice,
  getCategory,
  getRelatedProducts,
  products,
  type Product,
} from "@/data/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/produkter/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Produkt ikke fundet — TechBoks" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — TechBoks`;
    return {
      meta: [
        { title },
        { name: "description", content: product.shortDescription },
        { property: "og:title", content: title },
        { property: "og:description", content: product.shortDescription },
        { property: "og:image", content: product.images[0]! },
        { name: "twitter:image", content: product.images[0]! },
      ],
    };
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
  return <ProductDetail product={product} />;
}

function ProductDetail({ product }: { product: Product }) {
  const category = getCategory(product.category);
  const related = getRelatedProducts(product);
  const { add } = useCart();
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.options ?? []).map((o) => [o.label, o.values[0]!])),
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

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
    add(product.id, quantity, variant, selections);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container-tb py-10 lg:py-14">
      <Link
        to="/produkter"
        search={{ kategori: "alle", q: "" }}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Alle produkter
      </Link>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* min-w-0: grid items default to min-width:auto, which lets the
            content push the column past the viewport on narrow screens. */}
        <div className="min-w-0">
          <ProductGallery images={product.images} alt={product.name} focus={focusImage} />
          {modelPath && <Model3DViewer src={modelPath} className="mt-3 aspect-[4/3] w-full" />}
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
              className="inline-flex h-12 flex-1 min-w-48 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Lagt i kurven
                </>
              ) : (
                "Læg i kurv"
              )}
            </button>
          </div>


          <div className="rounded-blob bg-canvas mt-10 overflow-hidden">
            <h2 className="eyebrow border-ink/10 border-b px-5 py-3.5">Specifikationer</h2>
            <dl className="divide-ink/10 divide-y">
              {product.specifications.map((spec) => (
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
