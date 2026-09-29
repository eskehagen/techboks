/**
 * Strukturerede data (JSON-LD, schema.org).
 *
 * Hver side får én @graph, hvor virksomheden, ejeren og websitet altid har
 * samme @id. Så ved Google og AI-assistenter, at alle sider handler om den
 * samme TechBoks — og ikke om de andre firmaer i verden med samme navn.
 *
 * Kun bekræftede fakta. Der er med vilje ingen:
 *  - anmeldelser/AggregateRating (der er ingen at vise),
 *  - priceRange (der er rigtige priser på hvert produkt i stedet),
 *  - CVR/vatID (butikken har intet CVR-nummer).
 *
 * Returpolitikken (hasMerchantReturnPolicy) følger handelsbetingelserne: 14 dages
 * fortrydelsesret, retur med post, kunden betaler returfragten.
 */

import { getCategory, type Product } from "@/data/products";
import { IMAGE_SIZES } from "@/data/imageSizes";
import { getDeliveryPrice } from "@/lib/shipping";
import { DEFAULT_OG_IMAGE, SITE, absoluteUrl } from "./site";

type Node = Record<string, unknown>;

export const IDS = {
  business: `${SITE.url}/#business`,
  person: `${SITE.url}/#person`,
  website: `${SITE.url}/#website`,
};

const ref = (id: string) => ({ "@id": id });

export function baseGraph({ withEmail = false }: { withEmail?: boolean } = {}): Node[] {
  return [
    {
      // OnlineStore er den præcise type for en webshop uden fysisk butik.
      "@type": "OnlineStore",
      "@id": IDS.business,
      name: SITE.name,
      url: absoluteUrl("/"),
      description: SITE.description,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/favicon-192.png"),
        width: 192,
        height: 192,
      },
      image: absoluteUrl(DEFAULT_OG_IMAGE.src),
      founder: ref(IDS.person),
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.pickup,
        addressCountry: SITE.country.code,
      },
      areaServed: { "@type": "Country", name: SITE.country.name },
      knowsLanguage: "da",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: SITE.country.code,
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
        merchantReturnLink: absoluteUrl("/handelsbetingelser#fortrydelsesret"),
      },
      sameAs: [SITE.instagram],
      // E-mailen må kun stå på kontaktsiden.
      ...(withEmail
        ? {
            email: SITE.email,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              email: SITE.email,
              availableLanguage: "da",
            },
          }
        : {}),
    },
    {
      "@type": "Person",
      "@id": IDS.person,
      name: SITE.owner.name,
      jobTitle: SITE.owner.role,
      description:
        "Står bag TechBoks og tegner, måler op og 3D-printer selv alle produkterne i små serier.",
      worksFor: ref(IDS.business),
    },
    {
      "@type": "WebSite",
      "@id": IDS.website,
      url: absoluteUrl("/"),
      name: SITE.name,
      inLanguage: SITE.language,
      publisher: ref(IDS.business),
    },
  ];
}

export function webPage({
  path,
  title,
  description,
  type = "WebPage",
  image,
  breadcrumb = false,
  mainEntity,
  dateModified = SITE.updated,
}: {
  path: string;
  title: string;
  description: string;
  type?: string;
  image?: string | undefined;
  breadcrumb?: boolean;
  mainEntity?: string;
  dateModified?: string;
}): Node {
  const url = absoluteUrl(path);
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: SITE.language,
    isPartOf: ref(IDS.website),
    about: ref(IDS.business),
    dateModified,
    ...(image ? { primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(image) } } : {}),
    ...(breadcrumb ? { breadcrumb: ref(`${url}#breadcrumb`) } : {}),
    ...(mainEntity ? { mainEntity: ref(mainEntity) } : {}),
  };
}

export function breadcrumbList(path: string, items: { name: string; path: string }[]): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export const productPath = (p: Product) => `/produkter/${p.slug}`;

export function productNode(product: Product): Node {
  const url = absoluteUrl(productPath(product));
  const material = product.specifications.find((s) => s.label === "Materiale")?.value;
  const shipping = getDeliveryPrice(product.weight);
  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description.replace(/\s*\n\s*/g, " ").trim(),
    url,
    image: product.images.map((src) => {
      const size = IMAGE_SIZES[src];
      return size
        ? { "@type": "ImageObject", url: absoluteUrl(src), width: size.w, height: size.h }
        : absoluteUrl(src);
    }),
    sku: product.id,
    category: getCategory(product.category)?.name,
    ...(material ? { material } : {}),
    brand: { "@type": "Brand", name: SITE.name },
    manufacturer: ref(IDS.business),
    ...(product.category === "mustang-mach-e"
      ? {
          isAccessoryOrSparePartFor: {
            "@type": "Car",
            name: "Ford Mustang Mach-E",
            brand: { "@type": "Brand", name: "Ford" },
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: product.currency,
      // Handelsbetingelserne: "fremstilles efter behov og bestilling".
      availability: "https://schema.org/MadeToOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: ref(IDS.business),
      ...(shipping !== null
        ? {
            // Fragt for én stk. efter vægttabellen i src/lib/shipping.ts.
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingRate: { "@type": "MonetaryAmount", value: shipping, currency: "DKK" },
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "DK" },
            },
          }
        : {}),
    },
  };
}

export function productList(path: string, products: Product[]): Node {
  return {
    "@type": "ItemList",
    "@id": `${absoluteUrl(path)}#produkter`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(productPath(p)),
      name: p.name,
    })),
  };
}

export function jsonLd(nodes: Node[], options?: { withEmail?: boolean }) {
  return { "@context": "https://schema.org", "@graph": [...baseGraph(options), ...nodes] };
}

/** FAQPage built from the same data as the visible questions on /faq. */
export function faqPage(
  base: Node,
  categories: { items: { q: string; a: string }[] }[],
): Node {
  return {
    ...base,
    "@type": "FAQPage",
    mainEntity: categories.flatMap((c) =>
      c.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };
}
