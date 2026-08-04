import { motion } from "motion/react";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  compact = false,
}: {
  products: Product[];
  compact?: boolean;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-blob border-ink/15 bg-surface border border-dashed p-14 text-center">
        <p className="font-display text-ink text-xl font-semibold">Ingen produkter fundet</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Prøv en anden søgning eller vælg en anden kategori.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? "grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
          : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductCard product={product} index={i} compact={compact} />
        </motion.div>
      ))}
    </div>
  );
}
