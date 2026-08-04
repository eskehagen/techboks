/**
 * Product data layer.
 *
 * Mock data for now — the shape mirrors what an Airtable table will return so
 * that `getProducts()` / `getProduct()` can later be swapped for API calls
 * without touching any component.
 */

export type CategoryId = "mustang-mach-e" | "hjemmet";

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductOption {
  label: string;
  values: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: CategoryId;
  price: number;
  currency: "DKK";
  images: string[];
  specifications: ProductSpec[];
  options?: ProductOption[];
  featured: boolean;
}

import homeyProCover from "@/assets/homey-pro-cover.jpg";

const img = (file: string) => `https://www.techboks.dk/images/${file}`;

export const categories: Category[] = [
  {
    id: "mustang-mach-e",
    name: "Mustang Mach-E",
    slug: "mustang-mach-e",
    tagline: "Bilgadgets",
    description:
      "Specialdesignede tilbehør og praktiske gadgets, målt op efter din Ford Mustang Mach-E.",
    image: img("mustang_collage.jpg"),
  },
  {
    id: "hjemmet",
    name: "Hjemmet",
    slug: "hjemmet",
    tagline: "Smarte løsninger",
    description: "Diskrete, funktionelle produkter der løser små irritationsmomenter derhjemme.",
    image: homeyProCover,
  },
];

const petg: ProductSpec[] = [
  { label: "Materiale", value: "PETG — varmebestandig" },
  { label: "Produktion", value: "Printet i Danmark" },
  { label: "Leveringstid", value: "3–7 hverdage" },
];

const colorOption: ProductOption = {
  label: "Farve",
  values: ["Sort", "Hvid", "Rød", "Blå", "Grøn"],
};

export const products: Product[] = [
  {
    id: "tb-001",
    slug: "center-konsol-boks",
    name: "Center Konsol Boks",
    shortDescription: "Organiser din midterkonsol under armlænet",
    description:
      "Organiser dine ting i midterkonsollen med denne specialdesignede boks til Mustang Mach-E. Den passer præcist ned i rummet under armlænet, og der medfølger en kortholder til fx ladekort og ladebrikker.",
    category: "mustang-mach-e",
    price: 90,
    currency: "DKK",
    images: [
      img("centerConsol1.jpg"),
      img("centerConsol2.jpg"),
      img("centerConsol3.jpg"),
      img("centerConsol4.png"),
    ],
    specifications: [
      ...petg,
      { label: "Anvendelse", value: "Placeres i midterkonsollen under armlænet" },
    ],
    options: [colorOption],
    featured: true,
  },
  {
    id: "tb-002",
    slug: "front-boks",
    name: "Front Boks",
    shortDescription: "Udnyt pladsen oppe foran frontskærmen",
    description:
      "Udnyt det ubrugte rum foran frontskærmen. Front Boksen giver dig et diskret opbevaringsrum til småting, som ellers ville rulle rundt i kabinen.",
    category: "mustang-mach-e",
    price: 90,
    currency: "DKK",
    images: [img("frontBox1.jpg")],
    specifications: [...petg, { label: "Anvendelse", value: "Monteres foran frontskærmen" }],
    options: [colorOption],
    featured: true,
  },
  {
    id: "tb-003",
    slug: "vinter-cover",
    name: "Vinter Cover",
    shortDescription: "Beskyt ladeporten mod sne, is og skidt",
    description:
      "Et tætsluttende cover der beskytter din Mustang Mach-E's ladeport mod sne, is og vejsalt i vintermånederne.",
    category: "mustang-mach-e",
    price: 90,
    currency: "DKK",
    images: [img("vinterCover1.jpg")],
    specifications: [...petg, { label: "Anvendelse", value: "Sættes over ladeporten" }],
    options: [colorOption],
    featured: true,
  },
  {
    id: "tb-004",
    slug: "mustang-6-pack-daaseholder",
    name: "Mustang 6-pack til Dåser",
    shortDescription: "Unik 6-pack holder — ta' drikkevarerne med på farten",
    description:
      "En holder til seks dåser med Mustang-detalje. Holder drikkevarerne på plads under kørsel og fungerer lige så godt som bordholder til grillaftenen.",
    category: "mustang-mach-e",
    price: 150,
    currency: "DKK",
    images: [img("case6pack4.jpg")],
    specifications: [...petg, { label: "Kapacitet", value: "6 standard dåser" }],
    options: [colorOption],
    featured: true,
  },
  {
    id: "tb-005",
    slug: "ladekabel-ophaeng-std",
    name: "Ladekabel Ophæng (Std)",
    shortDescription: "Ophæng til almindeligt ladekabel",
    description:
      "Hold ladekablet oppe fra gulvet og undgå snavs og knæk. Passer til standard ladekabler.",
    category: "mustang-mach-e",
    price: 90,
    currency: "DKK",
    images: [img("ladekabel_hvid.jpg")],
    specifications: [...petg, { label: "Montering", value: "Skrues på væg" }],
    options: [colorOption],
    featured: false,
  },
  {
    id: "tb-006",
    slug: "ladekabel-ophaeng-large",
    name: "Ladekabel Ophæng (Large)",
    shortDescription: "Ophæng til langt ladekabel",
    description:
      "Den store udgave af vores kabelophæng, dimensioneret til lange og tykke ladekabler.",
    category: "mustang-mach-e",
    price: 150,
    currency: "DKK",
    images: [img("ladekabel_large1.jpg")],
    specifications: [...petg, { label: "Montering", value: "Skrues på væg" }],
    options: [colorOption],
    featured: false,
  },
  {
    id: "tb-007",
    slug: "anhaengertraek-prop",
    name: "Anhængertræk Prop",
    shortDescription: "Beskyt og pynt dit anhængertræk",
    description:
      "En prop med Mustang-motiv der beskytter anhængertrækkets kugle mod snavs — og giver et pænere udtryk.",
    category: "mustang-mach-e",
    price: 40,
    currency: "DKK",
    images: [img("anhangerProp.jpg")],
    specifications: [...petg, { label: "Anvendelse", value: "Sættes på anhængertrækket" }],
    options: [colorOption],
    featured: false,
  },
  {
    id: "tb-008",
    slug: "hattehylde-clips",
    name: "Hattehylde Clips",
    shortDescription: "Fastgør hattehylden sikkert. Pris for 2 stk.",
    description:
      "Praktiske clips der holder hattehylden sikkert på plads, så den ikke rasler under kørsel. Sælges i sæt af to.",
    category: "mustang-mach-e",
    price: 40,
    currency: "DKK",
    images: [img("hattehyldeClips1.jpg")],
    specifications: [...petg, { label: "Indhold", value: "2 stk." }],
    options: [colorOption],
    featured: false,
  },
  {
    id: "tb-009",
    slug: "skraldespand-sidedoer",
    name: "Skraldespand til Sidedør",
    shortDescription: "Smart skraldespand til sidedøren",
    description:
      "En kompakt skraldespand der monteres i sidedørens lomme. Hold bilen ren og ryddelig uden løse poser.",
    category: "mustang-mach-e",
    price: 70,
    currency: "DKK",
    images: [img("trashBin1.jpg")],
    specifications: [...petg, { label: "Montering", value: "Placeres i sidedørens lomme" }],
    options: [colorOption],
    featured: false,
  },
  {
    id: "tb-010",
    slug: "nakkestoette-krog",
    name: "Nakkestøtte Krog",
    shortDescription: "Krog til tasker, bøjler og indkøbsposer",
    description:
      "Monteres på nakkestøttens stænger og giver et solidt ophæng til indkøbsposer, tasker eller bøjler.",
    category: "mustang-mach-e",
    price: 40,
    currency: "DKK",
    images: [img("nakkestotteKrog3.jpg")],
    specifications: [...petg, { label: "Montering", value: "Klikkes på nakkestøttens stænger" }],
    options: [colorOption],
    featured: false,
  },
  {
    id: "tb-011",
    slug: "bagagerum-krog",
    name: "Bagagerum Krog",
    shortDescription: "Praktisk krog til bagagerummet. Pris for 2 stk.",
    description:
      "Hæng paraplyen op eller fastgør ting i bagagerummet. Sælges i sæt af to og monteres uden værktøj.",
    category: "mustang-mach-e",
    price: 60,
    currency: "DKK",
    images: [img("bagagerumkrog.jpg")],
    specifications: [...petg, { label: "Indhold", value: "2 stk." }],
    options: [colorOption],
    featured: false,
  },
  {
    id: "tb-012",
    slug: "front-boks-mobil-mount",
    name: "Front Boks Mobil-mount",
    shortDescription: "Mount til mobilholder på front boksen",
    description:
      "Tilbehør til Front Boksen: en mount der lader dig montere en almindelig mobilholder i synsfeltet.",
    category: "mustang-mach-e",
    price: 40,
    currency: "DKK",
    images: [img("frontBoxPhone.jpg")],
    specifications: [...petg, { label: "Kræver", value: "Front Boks" }],
    options: [colorOption],
    featured: false,
  },
  {
    id: "tb-013",
    slug: "skillerum-bagagerum",
    name: "Skillerum til Bagagerum",
    shortDescription: "Hold tingene på plads i bagagerummet",
    description:
      "Skillerum der deler bagagerummet op i faste zoner, så indkøbene ikke vælter rundt på vej hjem.",
    category: "mustang-mach-e",
    price: 60,
    currency: "DKK",
    images: [img("floorHolder1.jpg")],
    specifications: [...petg, { label: "Anvendelse", value: "Placeres i bagagerummet" }],
    options: [colorOption],
    featured: false,
  },
  {
    id: "tb-014",
    slug: "hattehylde-ophaengskrog",
    name: "Hattehylde Ophængskrog",
    shortDescription: "Reservedel — hvis din originale er knækket",
    description:
      "Forstærket ophængskrog til hattehylden. En direkte erstatning for den originale, hvis den er knækket.",
    category: "mustang-mach-e",
    price: 80,
    currency: "DKK",
    images: [img("hattehyldeMount.jpg")],
    specifications: [...petg, { label: "Type", value: "Reservedel" }],
    options: [colorOption],
    featured: false,
  },
  {
    id: "tb-015",
    slug: "mustang-logo-template",
    name: "Mustang Logo Template",
    shortDescription: "Skabelon med Mustang Mach-E logo",
    description:
      "Skabelon med Mustang Mach-E logo — perfekt til at markere gulvmåtter eller andre projekter præcist.",
    category: "mustang-mach-e",
    price: 70,
    currency: "DKK",
    images: [img("gulvmattetemplate.jpg")],
    specifications: [...petg, { label: "Anvendelse", value: "Skabelon / stencil" }],
    featured: false,
  },
  {
    id: "tb-016",
    slug: "homey-pro-cover",
    name: "Homey Pro Cover",
    shortDescription: "Cover til Homey Pro 23 og 26 — bedre luftcirkulation",
    description:
      "Et ventileret cover til Homey Pro (2023 og 2026), der forbedrer luftcirkulationen og holder enheden køligere — uden at gå på kompromis med udtrykket.",
    category: "hjemmet",
    price: 40,
    currency: "DKK",
    images: [homeyProCover],
    specifications: [...petg, { label: "Passer til", value: "Homey Pro 23 / 26" }],
    options: [colorOption],
    featured: true,
  },
];

/* --- Data access layer (swap for Airtable API later) --- */

export async function getProducts(): Promise<Product[]> {
  return products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export function getCategory(id: CategoryId): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function formatPrice(value: number): string {
  return `${value.toLocaleString("da-DK")} kr.`;
}
