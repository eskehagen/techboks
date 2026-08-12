/**
 * Shipping cost calculation.
 *
 * Ported from the old site's cart.js weight-tier table. Prices include a
 * packaging margin. Orders over 19 kg can only be picked up.
 */

export type ShippingMethod = "pickup" | "delivery";

const TIERS: { maxGrams: number; price: number }[] = [
  { maxGrams: 900, price: 45 },
  { maxGrams: 2850, price: 55 },
  { maxGrams: 4800, price: 65 },
  { maxGrams: 9500, price: 80 },
  { maxGrams: 19000, price: 135 },
];

/** Returns the delivery price in DKK, or null if the order is too heavy to send (pickup only). */
export function getDeliveryPrice(totalWeightGrams: number): number | null {
  const tier = TIERS.find((t) => totalWeightGrams <= t.maxGrams);
  return tier ? tier.price : null;
}
