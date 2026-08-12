import { categories } from "@/data/products";

interface Props {
  active: string;
  onChange: (slug: string) => void;
  counts: Record<string, number>;
  total: number;
}

export function CategoryFilter({ active, onChange, counts, total }: Props) {
  const options = [{ slug: "alle", name: "Alle produkter", count: total }].concat(
    categories.map((c) => ({ slug: c.slug, name: c.name, count: counts[c.slug] ?? 0 })),
  );

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const isActive = active === o.slug;
        return (
          <button
            key={o.slug}
            type="button"
            onClick={() => onChange(o.slug)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-ink bg-ink text-primary-foreground"
                : "border-border bg-surface text-muted-foreground hover:border-ink/30 hover:text-ink"
            }`}
          >
            {o.name}
            <span className={isActive ? "text-primary-foreground/60" : "text-muted-foreground/70"}>
              {o.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
