import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { CartPanel } from "./CartPanel";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/produkter", label: "Produkter", search: { kategori: "alle", q: "" } },
  { to: "/om", label: "Om TechBoks" },
  { to: "/kontakt", label: "Kontakt" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();
  const wrapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    if (!cartOpen) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setCartOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [cartOpen]);

  return (
    <header className="pointer-events-none sticky top-0 z-50 px-3 pt-3">
      <div className="bg-surface pointer-events-auto relative mx-auto flex max-w-[92rem] items-center gap-4 rounded-full py-2.5 pr-2.5 pl-5 shadow-[0_16px_40px_-30px_oklch(0.2_0.02_250/0.9)]">
        <Logo />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              {...("search" in item ? { search: item.search } : {})}
              className="text-ink/70 hover:bg-canvas hover:text-ink rounded-full px-4 py-2 text-sm font-medium transition-colors"
              activeProps={{ className: "text-ink bg-canvas" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div ref={wrapRef} className="ml-auto flex items-center gap-2">


          <button
            type="button"
            onClick={() => setCartOpen((v) => !v)}
            aria-expanded={cartOpen}
            aria-label="Vis indkøbskurv"
            className="bg-ink text-canvas flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-transform hover:scale-[1.03]"
          >
            <ShoppingBag className="h-4 w-4" />
            Kurv
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="bg-accent-mint text-accent-mint-foreground grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold"
              >
                {count}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {cartOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="absolute top-[calc(100%+0.75rem)] right-0 z-50 w-[min(22rem,calc(100vw-1.5rem))] origin-top-right"
              >
                <CartPanel onNavigate={() => setCartOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Luk menu" : "Åbn menu"}
            className="bg-canvas text-ink grid h-11 w-11 shrink-0 place-items-center rounded-full md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Scroll progress */}
        <motion.div
          style={{ scaleX: progress }}
          className="bg-accent-mint absolute inset-x-5 bottom-0 h-[3px] origin-left rounded-full"
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-surface rounded-blob pointer-events-auto mx-auto mt-2 max-w-[92rem] p-3 shadow-[0_20px_50px_-30px_oklch(0.2_0.02_250/0.9)] md:hidden"
          >
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                {...("search" in item ? { search: item.search } : {})}
                onClick={() => setOpen(false)}
                className="text-ink font-display block rounded-2xl px-4 py-3 text-2xl font-semibold tracking-tight"
              >
                {item.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
