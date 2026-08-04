import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { formatPrice, getCategory, type Product } from "@/data/products";

export function ProductCard({
  product,
  index = 0,
  compact = false,
}: {
  product: Product;
  index?: number;
  compact?: boolean;
}) {
  const category = getCategory(product.category);

  return (
    <motion.div className="group relative h-full" data-index={index}>
      <Link
        to="/produkter/$slug"
        params={{ slug: product.slug }}
        className="bg-surface rounded-blob-lg relative block h-full overflow-hidden transition-transform duration-500 group-hover:-translate-y-1.5"
      >
        <div
          className={`bg-muted relative overflow-hidden ${compact ? "aspect-square sm:aspect-[4/5]" : "aspect-[4/5]"}`}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <span
            className={`bg-canvas/90 text-ink absolute top-3 left-3 rounded-full font-semibold tracking-[0.14em] uppercase backdrop-blur sm:top-4 sm:left-4 ${
              compact ? "px-2 py-1 text-[9px] sm:text-[11px]" : "px-3 py-1.5 text-[11px]"
            }`}
          >
            {category?.name}
          </span>
          {!compact && (
            <span className="bg-ink text-canvas absolute right-4 bottom-4 grid h-11 w-11 translate-y-3 place-items-center rounded-full opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          )}
        </div>
        <div
          className={
            compact
              ? "p-3 sm:flex sm:items-start sm:justify-between sm:gap-4 sm:p-5"
              : "flex items-start justify-between gap-4 p-5"
          }
        >
          <div className="min-w-0">
            <h3
              className={`text-ink font-display truncate font-semibold tracking-tight ${compact ? "text-sm sm:text-lg" : "text-lg"}`}
            >
              {product.name}
            </h3>
            <p
              className={`text-muted-foreground mt-1 line-clamp-2 leading-relaxed ${compact ? "hidden text-sm sm:block" : "text-sm"}`}
            >
              {product.shortDescription}
            </p>
          </div>
          <span
            className={`font-display text-ink shrink-0 font-semibold ${compact ? "mt-1 block text-sm sm:mt-0 sm:text-lg" : "text-lg"}`}
          >
            {formatPrice(product.price)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
