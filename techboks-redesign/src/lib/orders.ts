/**
 * Order submission layer.
 *
 * This submits the order payload to the existing Google Apps Script endpoint,
 * which writes the order to Airtable and triggers the confirmation emails.
 * The payload shape is kept compatible with the original checkout flow.
 */

import type { ShippingMethod } from "./shipping";

/**
 * Teksten på bestillingsknappen. Ordrebekræftelsen sendes automatisk, så et
 * tryk på knappen gør aftalen bindende. Forbrugeraftaleloven § 12 kræver da, at
 * knappen siger "ordre med betalingsforpligtelse" eller noget lige så tydeligt,
 * ellers er kunden ikke bundet. Handelsbetingelserne citerer den samme tekst.
 */
export const ORDER_BUTTON_LABEL = "Bestil med betalingspligt";

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  notes: string;
}

export interface OrderLine {
  productId: string;
  /** Product slug — what the Airtable "Produkter" lookup matches on. */
  slug: string;
  name: string;
  variant?: string | undefined;
  /** Per-option choices, e.g. { "Årgang": "2025+", "Farve": "Hvid" }. */
  options?: Record<string, string> | undefined;
  quantity: number;
  unitPrice: number;
}

export interface OrderPayload {
  customer: OrderCustomer;
  lines: OrderLine[];
  /** Product subtotal, excluding shipping. */
  subtotal: number;
  shipping: { method: ShippingMethod; cost: number };
}

export interface OrderResult {
  ok: boolean;
  reference: string;
}

/** Apps Script-webappen, der modtager ordrer og fortrydelser (se withdrawal.ts). */
export const ORDER_ENDPOINT: string =
  import.meta.env["VITE_ORDER_ENDPOINT"] ??
  "https://script.google.com/macros/s/AKfycbxqL2a7yE_ahmjKlFURzXJC0qzPumTYhj4r9-mWinLJRO5SQLEJ0gC5alCnM2CR3UEk/exec";

/** Skal matche SECURITY_TOKEN i mail_scripts/google-apps-script-updated.gs. */
export const ORDER_TOKEN = "TB-8472-SECURE-991";

function buildLegacyPayload(payload: OrderPayload) {
  const address = [payload.customer.address, payload.customer.postalCode, payload.customer.city]
    .filter(Boolean)
    .join(", ");
  const total = payload.subtotal + payload.shipping.cost;

  return {
    token: ORDER_TOKEN,
    botField: "",
    customerName: payload.customer.name,
    customerEmail: payload.customer.email,
    customerPhone: payload.customer.phone,
    customerAddress: payload.customer.address,
    customerCityPostal: [payload.customer.postalCode, payload.customer.city].filter(Boolean).join(" "),
    customerNotes: payload.customer.notes,
    shippingMethod: payload.shipping.method,
    shippingCost: payload.shipping.cost,
    items: payload.lines.map((line) => ({
      // `id` is what the Apps Script looks up in Airtable's Produkter table
      // ("Website ID"); it reads slugs, not the internal tb-00x id.
      id: line.slug,
      name: line.name,
      quantity: line.quantity,
      price: line.unitPrice,
      variant: line.variant ?? "",
      options: line.options ?? {},
    })),
    subtotal: payload.subtotal,
    total,
    timestamp: new Date().toISOString(),
    _legacyAddress: address,
  };
}

export async function submitOrder(payload: OrderPayload): Promise<OrderResult> {
  const response = await fetch(ORDER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(buildLegacyPayload(payload)),
  });

  const text = await response.text();
  let data: { success?: boolean; error?: string; orderId?: string } | null = null;

  if (text) {
    try {
      data = JSON.parse(text) as { success?: boolean; error?: string; orderId?: string };
    } catch {
      // Ignore invalid JSON and rely on the HTTP status.
    }
  }

  if (!response.ok || data?.success !== true) {
    throw new Error(data?.error ?? "Kunne ikke sende ordren. Prøv igen senere.");
  }

  return {
    ok: true,
    reference: data?.orderId ?? `TB-${Date.now().toString().slice(-6)}`,
  };
}
