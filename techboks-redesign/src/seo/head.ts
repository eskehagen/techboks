/**
 * <head> for én side: title, description, canonical, Open Graph, Twitter og
 * JSON-LD. Bruges af alle ruters `head()`, så ingen side glemmer noget.
 *
 * Regler (tjekkes af `npm run validate`):
 *  - title højst 60 tegn og unik
 *  - description 140–155 tegn
 *  - canonical peger på sidens egen adresse (uden ?-parametre)
 */

import { DEFAULT_OG_IMAGE, absoluteUrl } from "./site";
import { jsonLd } from "./schema";

export interface OgImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function pageHead({
  path,
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  ogType = "website",
  noindex = false,
  graph,
  withEmail = false,
}: {
  path: string;
  title: string;
  description: string;
  image?: OgImage;
  ogType?: "website" | "product" | "article";
  noindex?: boolean;
  graph?: Record<string, unknown>[];
  withEmail?: boolean;
}) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image.src);
  const meta: Record<string, unknown>[] = [
    { title },
    { name: "description", content: description },
    {
      name: "robots",
      content: noindex ? "noindex, follow" : "index, follow, max-image-preview:large",
    },
    { property: "og:type", content: ogType },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: String(image.width) },
    { property: "og:image:height", content: String(image.height) },
    { property: "og:image:alt", content: image.alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
  ];
  if (graph) meta.push({ "script:ld+json": jsonLd(graph, { withEmail }) });

  return {
    meta,
    // En noindex-side skal ikke samtidig pege på sig selv som den rigtige.
    links: noindex ? [] : [{ rel: "canonical", href: url }],
  };
}
