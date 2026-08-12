import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/kurv")({
  head: () => ({
    meta: [
      { title: "Din kurv — TechBoks" },
      {
        name: "description",
        content:
          "Se din kurv hos TechBoks, justér antal og gå videre til ordreforespørgsel. Betaling foregår nemt via MobilePay bagefter.",
      },
      { property: "og:title", content: "Din kurv — TechBoks" },
      { property: "og:description", content: "Gennemgå din kurv og send din ordreforespørgsel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, count, total, setQuantity, remove } = useCart();

  return (
    <div className="container-tb pt-10 pb-24">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-blob-lg bg-ink text-canvas relative overflow-hidden p-8 sm:p-12"
      >
        <div className="bg-accent-mint/20 pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full blur-3xl" />
        <span className="text-canvas/50 text-xs tracking-[0.24em] uppercase">Trin 1 af 2</span>
        <h1 className="font-display mt-4 text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
          Din kurv
        </h1>
        <p className="text-canvas/60 mt-5 max-w-md text-sm leading-relaxed">
          {count === 0
            ? "Ingen varer endnu — find noget der løser et problem i hverdagen."
            : `${count} ${count === 1 ? "vare" : "varer"} klar til bestilling.`}
        </p>
      </motion.header>

      {lines.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-blob-lg border-ink/15 bg-surface mt-6 border border-dashed p-16 text-center"
        >
          <div className="bg-accent-mint text-accent-mint-foreground mx-auto grid h-14 w-14 place-items-center rounded-full">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <p className="font-display text-ink mt-6 text-2xl font-semibold">Kurven er tom</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Klik dig ind på et produkt, vælg farve og antal.
          </p>
          <Link
            to="/produkter"
            search={{ kategori: "alle", q: "" }}
            className="bg-ink text-canvas mt-8 inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold transition-transform hover:scale-[1.03]"
          >
            Se produkter
          </Link>
        </motion.div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {lines.map((line, i) => (
                <motion.li
                  key={`${line.productId}-${line.variant ?? ""}`}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40, scale: 0.96 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(i, 5) * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-blob bg-surface group grid grid-cols-[5rem_minmax(0,1fr)] gap-4 p-4 transition-shadow hover:shadow-xl sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center sm:p-5"
                >
                  <img
                    src={line.product.images[0]}
                    alt={line.product.name}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover transition-transform duration-500 group-hover:scale-[1.04] sm:h-28 sm:w-28"
                  />
                  <div className="min-w-0">
                    <Link
                      to="/produkter/$slug"
                      params={{ slug: line.product.slug }}
                      className="font-display text-ink text-lg font-semibold tracking-tight hover:underline"
                    >
                      {line.product.name}
                    </Link>
                    {line.variant && (
                      <span className="bg-canvas text-muted-foreground mt-2 inline-block rounded-full px-3 py-1 text-xs">
                        {line.variant}
                      </span>
                    )}
                    <p className="text-muted-foreground mt-1 text-sm">
                      {formatPrice(line.product.price)} pr. stk.
                    </p>
                    <div className="mt-3 flex items-center gap-3 sm:hidden">
                      <QuantityControl line={line} setQuantity={setQuantity} />
                      <RemoveButton line={line} remove={remove} />
                    </div>
                  </div>
                  <div className="hidden items-center gap-4 sm:flex">
                    <QuantityControl line={line} setQuantity={setQuantity} />
                    <motion.span
                      key={line.lineTotal}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display text-ink w-28 text-right text-lg font-semibold"
                    >
                      {formatPrice(line.lineTotal)}
                    </motion.span>
                    <RemoveButton line={line} remove={remove} />
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <motion.aside
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-blob-lg bg-ink text-canvas sticky top-28 overflow-hidden p-7"
          >
            <span className="text-canvas/50 text-xs tracking-[0.24em] uppercase">Opsummering</span>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-canvas/60">Varer</dt>
                <dd className="font-medium">{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-canvas/60">Fragt</dt>
                <dd className="text-canvas/60">Beregnes ved bekræftelse</dd>
              </div>
            </dl>
            <div className="border-canvas/15 mt-6 flex items-baseline justify-between border-t pt-6">
              <span className="text-sm font-semibold">I alt</span>
              <motion.span
                key={total}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-3xl font-semibold"
              >
                {formatPrice(total)}
              </motion.span>
            </div>
            <Link
              to="/bestil"
              className="bg-accent-mint text-accent-mint-foreground group mt-7 flex h-14 items-center justify-between rounded-full pr-2 pl-6 text-sm font-semibold transition-transform hover:scale-[1.02]"
            >
              Gå til kassen
              <span className="bg-ink text-canvas grid h-10 w-10 place-items-center rounded-full transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              to="/produkter"
              search={{ kategori: "alle", q: "" }}
              className="border-canvas/20 text-canvas hover:bg-canvas/10 mt-3 flex h-12 items-center justify-center rounded-full border text-sm font-semibold transition-colors"
            >
              Fortsæt med at handle
            </Link>
            <p className="text-canvas/50 mt-5 text-[11px] leading-relaxed">
              Du betaler ikke online. Vi bekræfter din ordre på mail, og betalingen sker via
              MobilePay.
            </p>
          </motion.aside>
        </div>
      )}
    </div>
  );
}

function QuantityControl({
  line,
  setQuantity,
}: {
  line: { productId: string; quantity: number; variant?: string | undefined };
  setQuantity: (id: string, q: number, variant?: string) => void;
}) {
  return (
    <div className="bg-canvas flex h-11 shrink-0 items-center rounded-full">
      <button
        type="button"
        aria-label="Færre"
        onClick={() => setQuantity(line.productId, line.quantity - 1, line.variant)}
        className="text-muted-foreground hover:text-ink grid h-11 w-10 place-items-center rounded-full"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <motion.span
        key={line.quantity}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 18 }}
        className="text-ink w-7 text-center text-sm font-semibold"
      >
        {line.quantity}
      </motion.span>
      <button
        type="button"
        aria-label="Flere"
        onClick={() => setQuantity(line.productId, line.quantity + 1, line.variant)}
        className="text-muted-foreground hover:text-ink grid h-11 w-10 place-items-center rounded-full"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function RemoveButton({
  line,
  remove,
}: {
  line: { productId: string; variant?: string | undefined };
  remove: (id: string, variant?: string) => void;
}) {
  return (
    <button
      type="button"
      aria-label="Fjern fra kurv"
      onClick={() => remove(line.productId, line.variant)}
      className="text-muted-foreground hover:bg-ink hover:text-canvas grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
