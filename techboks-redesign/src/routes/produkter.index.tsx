import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid, Rows3, Search, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductGrid } from "@/components/ProductGrid";
import { categories, products } from "@/data/products";


export const Route = createFileRoute("/produkter/")({
  validateSearch: (search: Record<string, unknown>) => ({
    kategori: typeof search["kategori"] === "string" ? (search["kategori"] as string) : "alle",
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Alle produkter — TechBoks 3D print" },
      {
        name: "description",
        content:
          "Browse alle TechBoks produkter: 3D printet tilbehør til Mustang Mach-E og smarte løsninger til hjemmet. Filtrér efter kategori og søg.",
      },
      { property: "og:title", content: "Alle produkter — TechBoks 3D print" },
      {
        property: "og:description",
        content: "3D printet tilbehør til bil og hjem. Filtrér, søg og find det du mangler.",
      },
    ],
  }),
  component: Catalogue,
});

function Catalogue() {
  const { kategori, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [atTop, setAtTop] = useState(true);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tb-catalogue-view");
    if (saved === "grid") setCompact(true);
  }, []);

  const setView = (value: boolean) => {
    setCompact(value);
    localStorage.setItem("tb-catalogue-view", value ? "grid" : "single");
  };

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);



  const counts = categories.reduce<Record<string, number>>((acc, c) => {
    acc[c.slug] = products.filter((p) => p.category === c.id).length;
    return acc;
  }, {});

  const query = q.trim().toLowerCase();
  const filtered = products.filter((p) => {
    const matchesCategory = kategori === "alle" || p.category === kategori;
    const matchesQuery =
      query === "" ||
      p.name.toLowerCase().includes(query) ||
      p.shortDescription.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="container-tb pt-10 pb-20">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-muted-foreground text-xs tracking-[0.24em] uppercase">Katalog</span>
          <h1 className="font-display text-ink mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Alle produkter
          </h1>
        </div>
        <div className="flex w-full items-center justify-between gap-4 sm:w-auto">
          <p className="text-muted-foreground text-sm">
            Viser {filtered.length} af {products.length} produkter
          </p>
          {/* Visningsvalg — kun relevant på små skærme */}
          <div
            role="group"
            aria-label="Vælg visning"
            className="bg-surface flex items-center gap-1 rounded-full p-1 sm:hidden"
          >
            <button
              type="button"
              onClick={() => setView(false)}
              aria-pressed={!compact}
              aria-label="Vis ét stort kort ad gangen"
              className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
                compact ? "text-muted-foreground" : "bg-ink text-canvas"
              }`}
            >
              <Rows3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView(true)}
              aria-pressed={compact}
              aria-label="Vis produkter i gitterform"
              className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
                compact ? "bg-ink text-canvas" : "text-muted-foreground"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>


      {/* Filter bar — collapses away as soon as you scroll, returns at the top */}
      <motion.div
        animate={atTop ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: atTop ? "auto" : "none" }}
        className="-mx-3 mt-8 px-3 py-3"
      >
        <div className="bg-surface rounded-blob flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
          <CategoryFilter
            active={kategori}
            counts={counts}
            total={products.length}
            onChange={(slug) => navigate({ to: ".", search: { kategori: slug, q } })}
          />
          <div className="relative w-full lg:max-w-xs">
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => navigate({ to: ".", search: { kategori, q: e.target.value } })}
              placeholder="Søg i produkter…"
              aria-label="Søg i produkter"
              className="border-border bg-canvas text-ink placeholder:text-muted-foreground focus:border-ink/30 focus:ring-ring/40 h-11 w-full rounded-full border pr-10 pl-11 text-sm outline-none focus:ring-2"
            />
            {q !== "" && (
              <button
                type="button"
                onClick={() => navigate({ to: ".", search: { kategori, q: "" } })}
                aria-label="Ryd søgning"
                className="text-muted-foreground hover:text-ink absolute top-1/2 right-3 -translate-y-1/2"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="mt-6">
        <ProductGrid products={filtered} compact={compact} />
      </div>
    </div>
  );
}
