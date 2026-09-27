import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactCta } from "@/components/OrderSteps";
import { Reveal } from "@/components/Reveal";
import type { FaqCategory } from "@/data/faq";
import { formatDanishDate } from "@/lib/dates";
import { pageHead } from "@/seo/head";
import { breadcrumbList, faqPage, webPage } from "@/seo/schema";
import { SITE } from "@/seo/site";

const PATH = "/faq";

export const Route = createFileRoute("/faq")({
  // Spørgsmålene hentes her i stedet for med en almindelig import: head() ligger
  // i det JavaScript, som alle sider henter, og det skal teksterne ikke.
  loader: async () => ({ faq: (await import("@/data/faq")).FAQ }),
  head: ({ loaderData }) => {
    const faq: FaqCategory[] = loaderData?.faq ?? [];
    const title = "Spørgsmål og svar om bestilling og levering | TechBoks";
    const description =
      "Svar på spørgsmål om TechBoks: bestilling, betaling med MobilePay, fragt og afhentning i Aarhus N, levering på 3–7 hverdage, årgange og reklamation.";
    return pageHead({
      path: PATH,
      title,
      description,
      graph: [
        faqPage(webPage({ path: PATH, title, description, breadcrumb: true }), faq),
        breadcrumbList(PATH, [
          { name: "Forside", path: "/" },
          { name: "Spørgsmål og svar", path: PATH },
        ]),
      ],
    });
  },
  component: FaqPage,
});

function FaqPage() {
  const { faq: FAQ } = Route.useLoaderData();
  return (
    <div className="container-tb pt-10 pb-20">
      <Breadcrumbs items={[{ name: "Forside", to: "/" }, { name: "Spørgsmål og svar" }]} />

      <header className="mt-8 max-w-3xl">
        <span className="eyebrow">Spørgsmål og svar</span>
        <h1 className="font-display text-ink mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Spørgsmål og svar om TechBoks
        </h1>
        <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">
          Her finder du svar om bestilling, betaling, levering, pasform og reklamation hos TechBoks.
          Finder du ikke svaret, så skriv til mig via kontaktsiden.
        </p>
        <p className="text-muted-foreground mt-3 text-sm">
          Senest opdateret <time dateTime={SITE.updated}>{formatDanishDate(SITE.updated)}</time>
        </p>
      </header>

      <nav aria-label="Genveje" className="mt-8">
        <ul className="flex flex-wrap gap-2">
          {FAQ.map((category) => (
            <li key={category.id}>
              <a
                href={`#${category.id}`}
                className="bg-surface text-ink hover:bg-ink hover:text-canvas inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                {category.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {FAQ.map((category) => (
        <section
          key={category.id}
          id={category.id}
          className="mt-16 scroll-mt-28"
          aria-labelledby={`${category.id}-titel`}
        >
          <Reveal>
            <h2
              id={`${category.id}-titel`}
              className="font-display text-ink text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {category.title}
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-3">
            {category.items.map((item) => (
              <div key={item.q} className="rounded-blob bg-surface p-6 sm:p-8">
                <h3 className="font-display text-ink text-xl font-semibold tracking-tight">
                  {item.q}
                </h3>
                <p className="text-muted-foreground mt-3 max-w-3xl text-base leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <ContactCta showFaq={false} />
    </div>
  );
}
