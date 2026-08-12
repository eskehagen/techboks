/**
 * Order submission layer.
 *
 * This submits the order payload to the existing Google Apps Script endpoint,
 * which writes the order to Airtable and triggers the confirmation emails.
 * The payload shape is kept compatible with the original checkout flow.
 */

import type { ShippingMethod } from "./shipping";

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
  name: string;
  variant?: string | undefined;
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

const orderEndpoint =
  import.meta.env.VITE_ORDER_ENDPOINT ??
  "https://script.google.com/macros/s/AKfycbxqL2a7yE_ahmjKlFURzXJC0qzPumTYhj4r9-mWinLJRO5SQLEJ0gC5alCnM2CR3UEk/exec";

function buildLegacyPayload(payload: OrderPayload) {
  const address = [payload.customer.address, payload.customer.postalCode, payload.customer.city]
    .filter(Boolean)
    .join(", ");
  const total = payload.subtotal + payload.shipping.cost;

  return {
    token: "TB-8472-SECURE-991",
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
      name: line.name,
      quantity: line.quantity,
      price: line.unitPrice,
      variant: line.variant ?? "",
    })),
    subtotal: payload.subtotal,
    total,
    timestamp: new Date().toISOString(),
    _legacyAddress: address,
  };
}

export async function submitOrder(payload: OrderPayload): Promise<OrderResult> {
  const response = await fetch(orderEndpoint, {
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
