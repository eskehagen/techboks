/**
 * Én kilde til fakta om TechBoks — bruges af <head>, JSON-LD, sitemap og
 * llms.txt. Ret her, så følger resten med.
 *
 * Alt her er bekræftet af ejeren (september 2026). Tilføj ikke noget, der ikke
 * er det: søgemaskiner og AI-assistenter gentager det, der står her.
 */

export const SITE = {
  /** Primært domæne (Vercel: techboks.dk sender videre til www). */
  url: "https://www.techboks.dk",
  name: "TechBoks",
  language: "da-DK",
  description:
    "Dansk webshop med 3D-printet tilbehør til Ford Mustang Mach-E og et par smarte løsninger til hjemmet. Hvert produkt tegnes fra bunden, måles op i bilen og printes i små serier i Danmark.",
  owner: {
    name: "Eske Hagen Sinding",
    role: "Ejer og designer",
  },
  /** Må kun vises på /kontakt (ejerens valg). */
  email: "eskehagen@gmail.com",
  instagram: "https://www.instagram.com/3design_by_eske",
  country: { name: "Danmark", code: "DK" },
  /**
   * Fysisk adresse, fx "Gadenavn 1, 8200 Aarhus N". E-handelsloven § 7 og
   * forbrugeraftaleloven § 8 kræver den på sitet, før kunden bestiller. Står
   * den her, vises den i handelsbetingelserne og privatlivspolitikken.
   * TODO EJER: udfyld. `npm run validate` advarer, så længe den mangler.
   */
  address: null as string | null,
  /** Afhentning efter aftale. */
  pickup: "Aarhus N",
  delivery: "Sendes med DAO eller GLS, eller afhentes i Aarhus N efter aftale",
  deliveryTime: "3–7 hverdage",
  payment: "MobilePay eller bankoverførsel",
  /**
   * Senest opdateret — bruges som <lastmod> i sitemap og dateModified i
   * JSON-LD for sider uden egen dato. Ret den, når du ændrer tekst på sitet.
   */
  updated: "2026-09-29",
} as const;

export const DEFAULT_OG_IMAGE = {
  src: "/og-image.jpg",
  alt: "Front Boks, skraldespand til sidedøren og 6-pack dåseholder fra TechBoks",
  width: 1200,
  height: 630,
};

/** "/om" → "https://www.techboks.dk/om". Forsiden får skråstreg, resten ikke. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return path === "/" ? `${SITE.url}/` : `${SITE.url}${path}`;
}
