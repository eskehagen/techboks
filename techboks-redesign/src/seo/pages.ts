/**
 * Sider, der skal i Google: bruges af sitemap.xml og llms.txt.
 *
 * Tilføjer du en ny side, så sæt den på listen her. Kurv og bestil er
 * noindex og hører ikke til. Produkter kommer automatisk med fra
 * src/data/products.ts.
 */

import { products } from "@/data/products";
import { productPath } from "./schema";
import { SITE } from "./site";

export interface SitePage {
  path: string;
  name: string;
  lastmod: string;
}

export const STATIC_PAGES: SitePage[] = [
  { path: "/", name: "Forside", lastmod: SITE.updated },
  { path: "/produkter", name: "Alle produkter", lastmod: SITE.updated },
  { path: "/mustang-mach-e", name: "Tilbehør til Ford Mustang Mach-E", lastmod: SITE.updated },
  { path: "/hjemmet", name: "Smarte løsninger til hjemmet", lastmod: SITE.updated },
  { path: "/faq", name: "Spørgsmål og svar", lastmod: SITE.updated },
  { path: "/om", name: "Om TechBoks", lastmod: SITE.updated },
  { path: "/kontakt", name: "Kontakt", lastmod: SITE.updated },
  { path: "/handelsbetingelser", name: "Handelsbetingelser", lastmod: SITE.updated },
];

export function indexablePages(): SitePage[] {
  return [
    ...STATIC_PAGES,
    ...products.map((p) => ({ path: productPath(p), name: p.name, lastmod: SITE.updated })),
  ];
}
