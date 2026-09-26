/**
 * 301-redirects fra adresser, der ikke findes længere. Bruges af
 * vite.config.ts (nitro routeRules) og tjekkes af scripts/validate.mjs.
 */

/**
 * Adresser fra det gamle, statiske site (GitHub Pages, nov. 2025 – feb. 2026).
 * Google kan have dem i sit indeks, så de sendes permanent (301) videre til
 * den side, der har overtaget indholdet — i stedet for at give 404.
 */
const OLD_PRODUCT_PAGES: Record<string, string> = {
  "6pack": "mustang-6-pack-daaseholder",
  anhangerprop: "anhaengertraek-prop",
  bagagerumkrog: "bagagerum-krog",
  centerboks: "center-konsol-boks",
  frontboks: "front-boks",
  frontboksmobilmount: "front-boks-mobil-mount",
  gulvmattetemplate: "mustang-logo-template",
  hattehyldeclips: "hattehylde-clips",
  hattehyldekrog: "hattehylde-ophaengskrog",
  "homey-pro-cover": "homey-pro-cover",
  kabelophang: "ladekabel-ophaeng-std",
  kabelophanglarge: "ladekabel-ophaeng-large",
  nakkestottekrog: "nakkestoette-krog",
  skillerum: "skillerum-bagagerum",
  skraldespand: "skraldespand-sidedoer",
};

const OLD_PAGES: Record<string, string> = {
  "/index.html": "/",
  "/mustang-mach-e.html": "/produkter?kategori=mustang-mach-e",
  "/hjemmet.html": "/produkter?kategori=hjemmet",
  "/kontakt.html": "/kontakt",
  "/handelsbetingelser.html": "/handelsbetingelser",
  "/cart.html": "/kurv",
  "/checkout.html": "/bestil",
  "/order-confirmation.html": "/",
  // Vinterdækslet sælges ikke længere.
  "/product_sites/vinterdeksel.html": "/produkter",
  ...Object.fromEntries(
    Object.entries(OLD_PRODUCT_PAGES).map(([old, slug]) => [
      `/product_sites/${old}.html`,
      `/produkter/${slug}`,
    ]),
  ),
};

// GitHub Pages svarede også uden ".html". Udeladt: /kontakt og
// /handelsbetingelser findes allerede, og /mustang-mach-e og /hjemmet bliver
// rigtige kategorisider.
const KEEP_WITHOUT_EXTENSION = [
  "/index.html",
  "/kontakt.html",
  "/handelsbetingelser.html",
  "/mustang-mach-e.html",
  "/hjemmet.html",
];
const withoutExtension = Object.entries(OLD_PAGES)
  .filter(([from]) => !KEEP_WITHOUT_EXTENSION.includes(from))
  .map(([from, to]) => [from.replace(/\.html$/, ""), to]);

/** Gammel adresse → ny adresse. */
export const REDIRECTS: Record<string, string> = Object.fromEntries([
  ...Object.entries(OLD_PAGES),
  ...withoutExtension,
]);
