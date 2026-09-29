import { FAQ } from "@/data/faq";
import { CATEGORY_PATHS, categories, formatPrice, products } from "@/data/products";
import { STATIC_PAGES } from "@/seo/pages";
import { productPath } from "@/seo/schema";
import { SITE, absoluteUrl } from "@/seo/site";

/**
 * /llms.txt — en kort, tekstbaseret oversigt til AI-assistenter (ChatGPT,
 * Claude, Perplexity m.fl.): hvem, hvad, hvor, og links til alle sider.
 * Bygges ud fra produktdata, så den aldrig kommer bagud.
 */
export function buildLlmsTxt(): string {
  const productLines = (categoryId: string) =>
    products
      .filter((p) => p.category === categoryId)
      .map(
        (p) =>
          `- [${p.name}](${absoluteUrl(productPath(p))}): ${formatPrice(p.price)} — ${p.shortDescription}`,
      );

  return [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `${SITE.name} ejes og drives af ${SITE.owner.name}, som selv tegner, måler op og 3D-printer alle produkterne.`,
    "",
    `- Sælger til: hele ${SITE.country.name}`,
    `- Levering: ${SITE.delivery}. Leveringstid ${SITE.deliveryTime}.`,
    `- Betaling: ${SITE.payment}. Man bestiller på sitet uden online betaling og får straks en ordrebekræftelse på mail med betalingsoplysninger.`,
    `- Priser: i danske kroner, ekskl. fragt. ${SITE.name} er ikke momsregistreret, så der er ingen moms i priserne.`,
    `- Fortrydelsesret: 14 dage fra modtagelsen af varen. Man fortryder med »Fortryd aftale« på ${absoluteUrl("/fortryd")} og får straks en kvittering på mail. Reklamationsret: 2 år efter købeloven.`,
    "- Privatliv: sitet sætter ingen cookies, og kundeoplysninger bruges kun til ordrer og svar på henvendelser.",
    "- Materialer: PETG til dele, der skal tåle varme, kulde og vibrationer, og bionedbrydeligt PLA til dele, der skal være simple og præcise. Produktionen bruger grøn strøm.",
    "- Tilpasning: farver, mål og detaljer kan tilpasses efter aftale.",
    `- Kontakt: kontaktformularen på ${absoluteUrl("/kontakt")} eller Instagram (${SITE.instagram}). Svar inden for 24 timer.`,
    "",
    ...categories.flatMap((c) => [
      `## ${c.name}`,
      "",
      `${c.description} Oversigt: ${absoluteUrl(CATEGORY_PATHS[c.id])}`,
      "",
      ...productLines(c.id),
      "",
    ]),
    "## Spørgsmål og svar",
    "",
    `Fra ${absoluteUrl("/faq")}:`,
    "",
    ...FAQ.flatMap((c) => c.items.flatMap((item) => [`### ${item.q}`, "", item.a, ""])),
    "## Sider",
    "",
    ...STATIC_PAGES.map((p) => `- [${p.name}](${absoluteUrl(p.path)})`),
    "",
  ].join("\n");
}
