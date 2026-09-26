import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/data/products";
import { indexablePages } from "@/seo/pages";
import { productPath } from "@/seo/schema";
import { absoluteUrl } from "@/seo/site";

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Produktbilleder med i sitemappet, så de kan findes i Google Billeder. */
const imagesByPath = new Map(
  products.map((p) => [productPath(p), p.images.map((src) => absoluteUrl(src))]),
);

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = indexablePages().map((page) =>
          [
            `  <url>`,
            `    <loc>${escapeXml(absoluteUrl(page.path))}</loc>`,
            `    <lastmod>${page.lastmod}</lastmod>`,
            ...(imagesByPath.get(page.path) ?? []).map(
              (src) => `    <image:image><image:loc>${escapeXml(src)}</image:loc></image:image>`,
            ),
            `  </url>`,
          ].join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
