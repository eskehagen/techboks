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
  /**
   * Optional value → image map. Selecting a value scrolls the product gallery to
   * that image, so a choice that changes what the customer receives (fit, shape)
   * is shown rather than just named. Every image listed here must also appear in
   * the product's `images` — that array is what the gallery actually renders.
   */
  imageByValue?: Record<string, string>;
  /**
   * Optional value → 3D model map, same idea as `imageByValue`: when the choice
   * is a different physical part, the rotatable preview should show that part.
   * Falls back to the product's own `modelPath` when a value isn't listed.
   */
  modelByValue?: Record<string, string>;
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
  /** Grams — used to calculate shipping cost. */
  weight: number;
  /** Path (under /models) to a rotatable 3D preview, when one exists. */
  modelPath?: string;
  specifications: ProductSpec[];
  options?: ProductOption[];
  featured: boolean;
}


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
    image: img("homey_cover_collage.png"),
  },
];

const petg: ProductSpec[] = [
  { label: "Materiale", value: "PETG — varmebestandig" },
  { label: "Produktion", value: "Printet i Danmark" },
  { label: "Leveringstid", value: "3–7 hverdage" },
];

/** Matches the old site's per-product color dropdowns — most products never offered "Sort". */
const colorOption4: ProductOption = {
  label: "Farve",
  values: ["Hvid", "Rød", "Blå", "Grøn"],
};

const colorOption6: ProductOption = {
  label: "Farve",
  values: ["Sort", "Hvid", "Grå", "Rød", "Blå", "Grøn"],
};

const sideOptionPlain: ProductOption = {
  label: "Version",
  values: ["Venstre", "Højre"],
};

const sideOptionCar: ProductOption = {
  label: "Version",
  values: ["Venstre (førersiden)", "Højre (passagersiden)"],
};

/**
 * The Mach-E's centre console changed shape with the 2025 model year, so the box
 * ships in two fits. Kept product-local rather than shared: the image map names
 * this product's own photos.
 */
const centerConsoleYearOption: ProductOption = {
  label: "Årgang",
  values: ["2021-2024", "2025+"],
  imageByValue: {
    "2021-2024": img("centerConsol1.jpg"),
    "2025+": img("centerConsol25-1.jpg"),
  },
  modelByValue: {
    "2021-2024": "/models/centerboks.stl",
    "2025+": "/models/centerboks25.stl",
  },
};

const patternOption: ProductOption = {
  label: "Mønster",
  values: ["Honeycomb", "Triangles", "Rectangles", "Cross Zag (45 grader)"],
};

export const products: Product[] = [
  {
    id: "tb-001",
    slug: "center-konsol-boks",
    name: "Center Konsol Boks",
    shortDescription: "Organiser din midterkonsol under armlænet",
    description:
      "Organiser dine ting i midterkonsollen med denne specialdesignede boks til Mustang Mach-E. Den passer præcist ned i rummet under armlænet, og der medfølger en kortholder til fx ladekort og ladebrikker. \n Husk at vælge årgang, så den passer til din bil.",
    category: "mustang-mach-e",
    price: 90,
    currency: "DKK",
    images: [
      img("centerConsol1.jpg"),
      img("centerConsol2.jpg"),
      img("centerConsol3.jpg"),
      img("centerConsol4.png"),
      img("centerConsol25-1.jpg"),
      img("centerConsol25-2.jpg"),
    ],
    weight: 290,
    modelPath: "/models/centerboks.stl",
    specifications: [
      { label: "Materiale", value: "PETG (varmebestandig)" },
      { label: "Farver", value: "Vælg selv farve af logo og linjer" },
      { label: "Anvendelse", value: "Placeres i midterkonsollen under armlænet" },
      { label: "Passer til", value: "Mach-E 2021-2024 og 2025+ — vælg årgang ovenfor" },
    ],
    options: [centerConsoleYearOption, colorOption4],
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
    images: [
      img("frontBox1.jpg"),
      img("frontBox2.jpg"),
      img("frontBox3.jpg"),
      img("frontbox4.jpg"),
      img("frontbox5.png"),
      img("frontBoxPhone.jpg"),
    ],
    weight: 480,
    modelPath: "/models/frontboks.stl",
    specifications: [
      { label: "Materiale", value: "PETG (varmebestandig)" },
      { label: "Farver", value: "Vælg selv farve af logo" },
      { label: "Anvendelse", value: "Placeres foran frontskærmen" },
    ],
    options: [colorOption4],
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
    images: [img("vinterCover1.jpg"), img("vinterCover2.jpg")],
    weight: 200,
    modelPath: "/models/vinterdeksel.stl",
    specifications: [
      { label: "Materiale", value: "PETG (vejrbestandig)" },
      { label: "Anvendelse", value: "Monteres i bilens ladeport" },
    ],
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
    images: [
      img("case6pack.jpg"),
      img("case6pack2.jpg"),
      img("case6pack3.jpg"),
      img("case6pack4.jpg"),
      img("case6pack5.jpg"),
      img("case6pack6.png"),
    ],
    weight: 440,
    modelPath: "/models/case6pack.stl",
    specifications: [
      { label: "Materiale", value: "PETG (stærk og holdbar)" },
      { label: "Kapacitet", value: "Plads til 6 dåser" },
      { label: "Farve", value: "Vælg selv farve af logo" },
      { label: "Design", value: "Elegant design med Mustang tema" },
    ],
    options: [colorOption4],
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
    images: [
      img("ladekabel_hvid.jpg"),
      img("ladekabel_std1.jpg"),
      img("ladekabel_std2.jpg"),
      img("ladekabel_std3.jpg"),
    ],
    weight: 200,
    modelPath: "/models/kabelophang.stl",
    specifications: [
      { label: "Materiale", value: "PETG (vejrbestandig)" },
      { label: "Farver", value: "Vælg selv farve af logo" },
      { label: "Anvendelse", value: "Ophæng på væggen og monter ladekablet" },
    ],
    options: [colorOption4],
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
    images: [
      img("ladekabel_large1.jpg"),
      img("ladekabel_large2.jpg"),
      img("ladekabel_large3.jpg"),
    ],
    weight: 340,
    modelPath: "/models/kabelophanglarge.stl",
    specifications: [
      { label: "Materiale", value: "PETG (vejrbestandig)" },
      { label: "Farver", value: "Vælg selv farve af logo" },
      { label: "Anvendelse", value: "Ophæng på væggen og monter ladekablet" },
    ],
    options: [colorOption4],
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
    images: [img("anhangerProp.jpg"), img("anhangerProp2.png")],
    weight: 20,
    modelPath: "/models/anhangerprop.stl",
    specifications: [
      { label: "Materiale", value: "PETG (vejrbestandig og holdbart)" },
      { label: "Farver", value: "Vælg selv farve af logo" },
      { label: "Anvendelse", value: "Monteres på trækkrogen" },
    ],
    options: [colorOption4],
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
    images: [img("hattehyldeClips1.jpg"), img("hattehyldeClips2.jpg")],
    weight: 10,
    modelPath: "/models/hattehyldeclips.stl",
    specifications: [
      { label: "Materiale", value: "PETG (varmebestandig og holdbar)" },
      { label: "Indhold", value: "2 stk clips til montering af en hattehylde" },
    ],
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
    images: [
      img("trashBin1.jpg"),
      img("trashBin2.jpg"),
      img("trashBin3.jpg"),
      img("trashBin4.jpg"),
    ],
    weight: 135,
    modelPath: "/models/skraldespand.stl",
    specifications: [
      { label: "Materiale", value: "PETG (varmebestandig og holdbar)" },
      { label: "Montering", value: "Monteres nemt direkte i sidedrørens udformning" },
      { label: "Kapacitet", value: "Optimal størrelse til hverdagsaffald" },
    ],
    options: [sideOptionCar],
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
    images: [
      img("nakkestotteKrog1.jpg"),
      img("nakkestotteKrog2.jpg"),
      img("nakkestotteKrog3.jpg"),
    ],
    weight: 20,
    modelPath: "/models/nakkestottekrog.stl",
    specifications: [
      { label: "Materiale", value: "PETG (stærk og solid)" },
      { label: "Montering", value: "Sættes fast på nakkestøttens stænger. Passer på både føre- og bagssæder" },
      { label: "Bæreevne", value: "Kan bære op til flere kilo uden problemer" },
    ],
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
    weight: 30,
    modelPath: "/models/bagagerumkrog.stl",
    specifications: [
      { label: "Materiale", value: "PETG (stærk og kraftig)" },
      { label: "Montering", value: "Monteres på Isofix beslag" },
    ],
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
    weight: 10,
    modelPath: "/models/frontboksmobilmount.stl",
    specifications: [
      { label: "Materiale", value: "PETG" },
      { label: "Kompatibilitet", value: "Diverse mobilholdere kan monteres" },
      { label: "Montering", value: "Placeret på Front Boksen" },
    ],
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
    price: 80,
    currency: "DKK",
    images: [
      img("floorHolder1.jpg"),
      img("floorHolder2.jpg"),
      img("floorHolder3.jpg"),
    ],
    weight: 220,
    modelPath: "/models/skillerum.stl",
    specifications: [
      { label: "Materiale", value: "PETG (robust og holdbar)" },
      { label: "Farve", value: "Vælg selv farve af logo" },
      { label: "Fleksibel", value: "Kan placeres på hele bagagerumsgulvet via velcro" },
    ],
    options: [colorOption4],
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
    weight: 30,
    modelPath: "/models/hattehyldekrogmount.stl",
    specifications: [
      { label: "Materiale", value: "PETG (robust og holdbar)" },
      { label: "Funktion", value: "Ophæng hattehylden sikkert" },
      { label: "Kompatibilitet", value: "Passer til Mustang Mach-E's hattehylde" },
      { label: "Montering", value: "Nem montering via klik-system og skruer" },
    ],
    options: [sideOptionPlain],
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
    images: [
      img("gulvmattetemplate3.jpg"),
      img("gulvmattetemplate2.jpg"),
    ],
    weight: 40,
    modelPath: "/models/gulvmattetemplate.stl",
    specifications: [
      { label: "Materiale", value: "PETG (holdbar)" },
      { label: "Anvendelse", value: "Placer skabelonen på gulvmåtten og børst hen over for at få logoet frem" },
      { label: "Fleksibel", value: "Kan bruges igen og igen" },
    ],
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
    images: [
      img("homeycover_1.jpg"),
      img("homeycover_2.jpg"),
      img("homeycover_3.jpg"),
      img("homeycover_4.jpg"),
      img("homey_cover_collage.png"),
    ],
    weight: 50,
    specifications: [...petg, { label: "Passer til", value: "Homey Pro 23 / 26" }],
    options: [colorOption6, patternOption],
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
