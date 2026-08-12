import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useCart } from "@/lib/cart";

/** Unified cart card — used by the sticky product-page rail and the header dropdown. */
export function CartPanel({ onNavigate }: { onNavigate?: () => void }) {
  const { lines, count, total } = useCart();

  return (
    <div className="rounded-blob-lg bg-surface flex max-h-[calc(100dvh-8rem)] flex-col overflow-hidden shadow-xl">
      <div className="bg-ink px-5 py-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-canvas text-2xl font-semibold tracking-tight">
            Indkøbskurv
          </h2>
          <motion.span
            key={count}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
            className="text-canvas/60 text-xs font-medium tracking-wide"
          >
            {count} {count === 1 ? "vare" : "varer"}
          </motion.span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <AnimatePresence initial={false}>
          {lines.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-ink/10 text-muted-foreground rounded-blob border border-dashed p-5 text-sm leading-relaxed"
            >
              Kurven er tom. Klik dig ind på et produkt, vælg farve og antal — og læg det i kurven.
            </motion.p>
          ) : (
            <ul className="space-y-2">
              {lines.map((line) => (
                <motion.li
                  key={`${line.productId}-${line.variant ?? ""}`}
                  layout
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="bg-canvas rounded-blob flex items-center gap-3 p-2.5"
                >
                  <img
                    src={line.product.images[0]}
                    alt={line.product.name}
                    className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-ink truncate text-sm font-semibold">{line.product.name}</p>
                    {line.variant && (
                      <p className="text-muted-foreground truncate text-xs">{line.variant}</p>
                    )}
                    <p className="text-muted-foreground text-xs">
                      {line.quantity} × {formatPrice(line.product.price)}
                    </p>
                  </div>
                  <QtyStepper line={line} />
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-ink text-canvas m-3 mt-0 rounded-[1.5rem] p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-canvas/60 text-xs tracking-[0.18em] uppercase">I alt</span>
          <motion.span
            key={total}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl font-semibold"
          >
            {formatPrice(total)}
          </motion.span>
        </div>
        <Link
          to="/kurv"
          onClick={onNavigate}
          className="bg-accent-mint text-accent-mint-foreground group mt-4 flex h-12 items-center justify-between rounded-full pr-1.5 pl-5 text-sm font-semibold transition-transform hover:scale-[1.02]"
        >
          Se kurven
          <span className="bg-ink text-canvas grid h-9 w-9 place-items-center rounded-full transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
        <p className="text-canvas/50 mt-3 text-[11px] leading-relaxed">
          Ingen online betaling — du får en bekræftelse og betaler via MobilePay.
        </p>
      </div>
    </div>
  );
}

function QtyStepper({
  line,
}: {
  line: { productId: string; quantity: number; variant?: string | undefined };
}) {
  const { setQuantity } = useCart();
  return (
    <div className="border-ink/10 flex flex-col items-center rounded-full border">
      <button
        type="button"
        aria-label="Flere"
        onClick={() => setQuantity(line.productId, line.quantity + 1, line.variant)}
        className="text-muted-foreground hover:text-ink grid h-6 w-7 place-items-center"
      >
        <Plus className="h-3 w-3" />
      </button>
      <button
        type="button"
        aria-label="Færre"
        onClick={() => setQuantity(line.productId, line.quantity - 1, line.variant)}
        className="text-muted-foreground hover:text-ink grid h-6 w-7 place-items-center"
      >
        <Minus className="h-3 w-3" />
      </button>
    </div>
  );
}
