import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product } from "@/data/products";

export interface CartLine {
  productId: string;
  quantity: number;
  variant?: string | undefined;
  /**
   * The same choices as `variant`, but still split by option label — the order
   * payload needs them addressable ("Årgang" → "2025+") rather than joined into
   * one display string. Lines saved before this existed simply lack it.
   */
  options?: Record<string, string> | undefined;
}


export interface CartLineView extends CartLine {
  product: Product;
  lineTotal: number;
}

interface CartContextValue {
  lines: CartLineView[];
  count: number;
  total: number;
  totalWeight: number;
  add: (
    productId: string,
    quantity?: number,
    variant?: string,
    options?: Record<string, string>,
  ) => void;
  remove: (productId: string, variant?: string) => void;
  setQuantity: (productId: string, quantity: number, variant?: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "techboks-cart-v1";

const sameLine = (l: CartLine, productId: string, variant?: string) =>
  l.productId === productId && (l.variant ?? "") === (variant ?? "");

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const views: CartLineView[] = lines.flatMap((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return [];
      return [{ ...line, product, lineTotal: product.price * line.quantity }];
    });

    return {
      lines: views,
      count: views.reduce((sum, l) => sum + l.quantity, 0),
      total: views.reduce((sum, l) => sum + l.lineTotal, 0),
      totalWeight: views.reduce((sum, l) => sum + l.product.weight * l.quantity, 0),
      add: (productId, quantity = 1, variant, options) =>
        setLines((prev) => {
          const existing = prev.find((l) => sameLine(l, productId, variant));
          if (existing) {
            return prev.map((l) =>
              sameLine(l, productId, variant) ? { ...l, quantity: l.quantity + quantity } : l,
            );
          }
          const line: CartLine = { productId, quantity, variant };
          if (options && Object.keys(options).length > 0) line.options = options;
          return [...prev, line];
        }),
      remove: (productId, variant) =>
        setLines((prev) => prev.filter((l) => !sameLine(l, productId, variant))),
      setQuantity: (productId, quantity, variant) =>
        setLines((prev) =>
          quantity <= 0
            ? prev.filter((l) => !sameLine(l, productId, variant))
            : prev.map((l) => (sameLine(l, productId, variant) ? { ...l, quantity } : l)),
        ),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
