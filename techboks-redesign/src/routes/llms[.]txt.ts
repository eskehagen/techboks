import { createFileRoute } from "@tanstack/react-router";
import { categories, formatPrice, products } from "@/data/products";
import { STATIC_PAGES } from "@/seo/pages";
import { productPath } from "@/seo/schema";
import { SITE, absoluteUrl } from "@/seo/site";

/**
 * /llms.txt — en kort, tekstbaseret oversigt til AI-assistenter (ChatGPT,
 * Claude, Perplexity m.fl.): hvem, hvad, hvor, og links til alle sider.
 * Bygges ud fra produktdata, så den aldrig kommer bagud.
 */
function buildLlmsTxt(): string {
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
    `- Betaling: ${SITE.payment}. Man sender en ordreforespørgsel på sitet, og ordren er bindende, når ${SITE.name} har bekræftet den.`,
    "- Priser: i danske kroner, ekskl. fragt.",
    "- Materialer: PETG til dele, der skal tåle varme, kulde og vibrationer, og PLA til dele, der skal være simple og præcise. Produktionen bruger grøn strøm.",
    "- Tilpasning: farver, mål og detaljer kan tilpasses efter aftale.",
    `- Kontakt: kontaktformularen på ${absoluteUrl("/kontakt")} eller Instagram (${SITE.instagram}). Svar inden for 24 timer.`,
    "",
    ...categories.flatMap((c) => [`## ${c.name}`, "", c.description, "", ...productLines(c.id), ""]),
    "## Sider",
    "",
    ...STATIC_PAGES.map((p) => `- [${p.name}](${absoluteUrl(p.path)})`),
    "",
  ].join("\n");
}

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(buildLlmsTxt(), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
