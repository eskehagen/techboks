import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-workshop.webp";
import heroImage800 from "@/assets/hero-workshop-800.webp";
import { pageHead } from "@/seo/head";
import { SITE } from "@/seo/site";
import { IDS, webPage } from "@/seo/schema";

export const Route = createFileRoute("/om")({
  head: () => {
    const path = "/om";
    const title = "Om TechBoks – Eske Hagen Sinding designer og printer";
    const description =
      "TechBoks er Eske Hagen Sindings danske webshop med 3D-printet tilbehør til Ford Mustang Mach-E. Hvert produkt tegnes fra bunden og printes i små serier.";
    return pageHead({
      path,
      title,
      description,
      graph: [webPage({ path, title, description, type: "AboutPage", mainEntity: IDS.person })],
    });
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="container-tb py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="max-w-xl">
          <span className="eyebrow">Om TechBoks</span>
          <h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">
            Ét print ad gangen
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Jeg hedder {SITE.owner.name} og står bag TechBoks. Her kombinerer jeg passion for
              design og innovation med funktionelle 3D printede produkter. Jeg laver ting, der ikke
              bare ser godt ud, men også løser konkrete udfordringer i hverdagen.
            </p>
            <p>
              Hvert produkt tegnes fra bunden af mig med fokus på funktionalitet, holdbarhed og æstetik —
              fra specialdesignede bilgadgets til smarte løsninger i hjemmet. Alt produceres i små
              serier på mine egne printere med bæredygtige materialer og grøn strøm.
            </p>
            <p>
              Min vision er enkel: at gøre gennemtænkte, funktionelle produkter tilgængelige for alle
              — og gøre din hverdag en anelse nemmere.
            </p>
          </div>
          <Link
            to="/produkter"
            search={{ kategori: "alle", q: "" }}
            className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-primary-foreground"
          >
            Se produkterne
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <img
            src={heroImage}
            srcSet={`${heroImage800} 800w, ${heroImage} 1600w`}
            sizes="(min-width: 1024px) 45vw, 95vw"
            alt="Illustration af en 3D-printer i gang på et værkstedsbord"
            loading="lazy"
            width={1600}
            height={1200}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
