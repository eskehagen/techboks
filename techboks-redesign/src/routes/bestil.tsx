import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Check, Package, Truck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { formatPrice } from "@/data/products";
import { useCart } from "@/lib/cart";
import { submitOrder, type OrderCustomer } from "@/lib/orders";
import { getDeliveryPrice, type ShippingMethod } from "@/lib/shipping";

export const Route = createFileRoute("/bestil")({
  head: () => ({
    meta: [
      { title: "Send ordreforespørgsel — TechBoks" },
      {
        name: "description",
        content:
          "Udfyld dine oplysninger og send din ordreforespørgsel til TechBoks. Vi bekræfter på mail, og betaling sker via MobilePay.",
      },
      { property: "og:title", content: "Send ordreforespørgsel — TechBoks" },
      {
        property: "og:description",
        content: "Bestil dine 3D printede produkter — betaling via MobilePay efter bekræftelse.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrderPage,
});

const empty: OrderCustomer = {
  name: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  notes: "",
};

function OrderPage() {
  const { lines, total, totalWeight, clear } = useCart();
  const [customer, setCustomer] = useState<OrderCustomer>(empty);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("pickup");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const deliveryPrice = getDeliveryPrice(totalWeight);
  const deliveryAvailable = deliveryPrice !== null;
  const effectiveShippingMethod = deliveryAvailable ? shippingMethod : "pickup";
  const shippingCost = effectiveShippingMethod === "delivery" ? (deliveryPrice ?? 0) : 0;
  const orderTotal = total + shippingCost;

  const update = (key: keyof OrderCustomer, value: string) =>
    setCustomer((c) => ({ ...c, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    try {
      await submitOrder({
        customer,
        lines: lines.map((l) => ({
          productId: l.productId,
          name: l.product.name,
          variant: l.variant,
          quantity: l.quantity,
          unitPrice: l.product.price,
        })),
        subtotal: total,
        shipping: { method: effectiveShippingMethod, cost: shippingCost },
      });
      clear();
      setStatus("done");
    } catch (error) {
      setStatus("idle");
      setErrorMessage(
        error instanceof Error ? error.message : "Kunne ikke sende ordren. Prøv igen senere.",
      );
    }
  };

  if (status === "done") {
    return (
      <div className="container-tb pt-10 pb-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-blob-lg bg-ink text-canvas relative mx-auto max-w-2xl overflow-hidden p-10 text-center sm:p-16"
        >
          <div className="bg-accent-mint/25 pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
            className="bg-accent-mint text-accent-mint-foreground relative mx-auto grid h-16 w-16 place-items-center rounded-full"
          >
            <Check className="h-7 w-7" />
          </motion.div>
          <h1 className="font-display relative mt-8 text-4xl leading-[1] font-semibold tracking-tight sm:text-5xl">
            Tak for din forespørgsel
          </h1>
          <p className="text-canvas/60 relative mx-auto mt-5 max-w-md text-sm leading-relaxed">
            Vi har modtaget din ordre og vender tilbage på mail med en bekræftelse samt et
            MobilePay-nummer til betaling.
          </p>
          <Link
            to="/produkter"
            search={{ kategori: "alle", q: "" }}
            className="bg-accent-mint text-accent-mint-foreground group relative mt-9 inline-flex h-13 items-center gap-3 rounded-full py-3.5 pr-2 pl-6 text-sm font-semibold transition-transform hover:scale-[1.03]"
          >
            Tilbage til produkterne
            <span className="bg-ink text-canvas grid h-9 w-9 place-items-center rounded-full transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-tb pt-10 pb-24">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-blob-lg bg-ink text-canvas relative overflow-hidden p-8 sm:p-12"
      >
        <div className="bg-accent-mint/20 pointer-events-none absolute -right-16 -bottom-24 h-72 w-72 rounded-full blur-3xl" />
        <span className="text-canvas/50 text-xs tracking-[0.24em] uppercase">Trin 2 af 2</span>
        <h1 className="font-display mt-4 text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
          Ordreforespørgsel
        </h1>
        <p className="text-canvas/60 mt-5 max-w-lg text-sm leading-relaxed">
          Der er ingen online betaling. Udfyld dine oplysninger, så bekræfter vi ordren på mail med
          pris inkl. fragt og et MobilePay-nummer.
        </p>
      </motion.header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSubmit}
          className="rounded-blob-lg bg-surface p-6 sm:p-8"
        >
          <span className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
            Dine oplysninger
          </span>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Navn" required value={customer.name} onChange={(v) => update("name", v)} />
            <Field
              label="E-mail"
              type="email"
              required
              value={customer.email}
              onChange={(v) => update("email", v)}
            />
            <Field
              label="Telefon"
              type="tel"
              required
              value={customer.phone}
              onChange={(v) => update("phone", v)}
            />
            <Field
              label="Adresse"
              required
              value={customer.address}
              onChange={(v) => update("address", v)}
            />
            <Field
              label="Postnummer"
              required
              value={customer.postalCode}
              onChange={(v) => update("postalCode", v)}
            />
            <Field label="By" required value={customer.city} onChange={(v) => update("city", v)} />
          </div>

          <div className="mt-5">
            <label className="text-ink block text-sm font-medium" htmlFor="notes">
              Bemærkninger til ordren
            </label>
            <textarea
              id="notes"
              rows={4}
              value={customer.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Ønsker du en særlig farve, tekst eller tilpasning? Skriv det her."
              className="bg-canvas text-ink placeholder:text-muted-foreground focus:ring-ink/20 mt-2 w-full rounded-3xl border-0 px-5 py-4 text-sm outline-none focus:ring-2"
            />
          </div>

          <div className="mt-5">
            <span className="text-ink block text-sm font-medium">Levering</span>
            {deliveryAvailable ? (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <ShippingOption
                  icon={Package}
                  label="Afhentning"
                  price="0 kr."
                  selected={shippingMethod === "pickup"}
                  onClick={() => setShippingMethod("pickup")}
                />
                <ShippingOption
                  icon={Truck}
                  label="Forsendelse"
                  price={`${deliveryPrice} kr.`}
                  selected={shippingMethod === "delivery"}
                  onClick={() => setShippingMethod("delivery")}
                />
              </div>
            ) : (
              <p className="bg-canvas text-muted-foreground mt-2 rounded-2xl px-5 py-4 text-sm">
                Din ordre vejer over 19 kg og kan derfor kun afhentes.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={lines.length === 0 || status === "sending"}
            className="bg-ink text-canvas group mt-8 flex h-14 w-full items-center justify-between rounded-full pr-2 pl-6 text-sm font-semibold transition-transform hover:scale-[1.01] disabled:scale-100 disabled:opacity-40"
          >
            {status === "sending" ? "Sender…" : "Send ordreforespørgsel"}
            <span className="bg-accent-mint text-accent-mint-foreground grid h-10 w-10 place-items-center rounded-full transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
          {errorMessage && (
            <p className="text-destructive mt-3 text-center text-sm">{errorMessage}</p>
          )}
          {lines.length === 0 && (
            <p className="text-muted-foreground mt-3 text-center text-xs">
              Din kurv er tom — tilføj produkter først.
            </p>
          )}
        </motion.form>

        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-blob-lg bg-surface sticky top-28 p-6 sm:p-7"
        >
          <span className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
            Din ordre
          </span>
          <ul className="mt-6 space-y-3">
            {lines.map((line) => (
              <li
                key={`${line.productId}-${line.variant ?? ""}`}
                className="bg-canvas rounded-blob flex items-center gap-3 p-3"
              >
                <img
                  src={line.product.images[0]}
                  alt={line.product.name}
                  loading="lazy"
                  className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-ink truncate text-sm font-semibold">{line.product.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {line.variant ? `${line.variant} · ` : ""}
                    {line.quantity} stk.
                  </p>
                </div>
                <span className="text-ink shrink-0 text-sm font-semibold">
                  {formatPrice(line.lineTotal)}
                </span>
              </li>
            ))}
            {lines.length === 0 && (
              <li className="border-ink/10 text-muted-foreground rounded-blob border border-dashed p-5 text-sm">
                Ingen varer
              </li>
            )}
          </ul>
          <div className="bg-ink text-canvas mt-5 rounded-[1.5rem] p-5">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-canvas/60">Varer</dt>
                <dd className="font-medium">{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-canvas/60">Fragt</dt>
                <dd className="font-medium">
                  {deliveryAvailable ? formatPrice(shippingCost) : "Afhentning"}
                </dd>
              </div>
            </dl>
            <div className="border-canvas/15 mt-3 flex items-baseline justify-between border-t pt-3">
              <span className="text-canvas/60 text-xs tracking-[0.18em] uppercase">I alt</span>
              <span className="font-display text-2xl font-semibold">{formatPrice(orderTotal)}</span>
            </div>
            <p className="text-canvas/50 mt-3 text-[11px] leading-relaxed">
              Betaling via MobilePay, når ordren er bekræftet.
            </p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

function ShippingOption({
  icon: Icon,
  label,
  price,
  selected,
  onClick,
}: {
  icon: typeof Package;
  label: string;
  price: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
        selected
          ? "border-ink bg-ink text-canvas"
          : "border-border bg-canvas text-ink hover:border-ink/30"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        <span className={`block text-xs ${selected ? "text-canvas/60" : "text-muted-foreground"}`}>
          {price}
        </span>
      </span>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/[^a-z]/g, "");
  return (
    <div>
      <label htmlFor={id} className="text-ink block text-sm font-medium">
        {label}
        {required && <span className="text-muted-foreground"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-canvas text-ink focus:ring-ink/20 mt-2 h-12 w-full rounded-full border-0 px-5 text-sm outline-none focus:ring-2"
      />
    </div>
  );
}
