import { Link } from "@tanstack/react-router";
import { CATEGORY_PATHS, categories } from "@/data/products";
import { WITHDRAWAL_LINK_LABEL } from "@/lib/withdrawal";
import { SITE } from "@/seo/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="px-3 pb-3">
      <div className="rounded-blob-lg bg-ink text-canvas mt-6 p-7 sm:p-12">
        <div className="max-w-md">
          <div className="bg-canvas inline-flex rounded-full px-4 py-2">
            <Logo />
          </div>
          <p className="font-display mt-8 text-3xl leading-[1.05] font-semibold tracking-tight sm:text-4xl">
            Dansk design og udvikling.
            <br />
            Printet i små serier.
          </p>
          <p className="text-canvas/55 mt-5 max-w-sm text-sm leading-relaxed">
            Produkter der løser konkrete hverdagsproblemer — tegnet fra bunden, målt op og
            printet i vores eget værksted.
          </p>
        </div>

        <nav className="border-canvas/15 text-canvas/80 mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t pt-8 text-sm">
          {categories.map((c) => (
            <Link key={c.id} to={CATEGORY_PATHS[c.id]} className="link-underline">
              {c.name}
            </Link>
          ))}
          <Link to="/produkter" search={{ kategori: "alle", q: "" }} className="link-underline">
            Alle produkter
          </Link>
          <Link to="/om" className="link-underline">
            Om TechBoks
          </Link>
          <Link to="/faq" className="link-underline">
            Spørgsmål og svar
          </Link>
          <Link to="/kontakt" className="link-underline">
            Kontakt
          </Link>
          {/* Forbrugeraftaleloven § 20 a: fortrydelsesfunktionen skal være fremtrædende,
              så linket er stylet anderledes end de andre links. */}
          <Link
            to="/fortryd"
            className="border-canvas/40 text-canvas hover:bg-canvas/10 inline-flex items-center rounded-full border px-4 py-1.5 font-semibold transition-colors"
          >
            {WITHDRAWAL_LINK_LABEL}
          </Link>
        </nav>

        <p className="text-canvas/55 mt-6 text-sm">
          {SITE.name} v/ {SITE.owner.name} · Sender til hele {SITE.country.name} · Afhentning i{" "}
          {SITE.pickup}
        </p>

        <div className="border-canvas/15 text-canvas/50 mt-8 border-t pt-6 text-center text-xs">
          © {new Date().getFullYear()} TechBoks - Alle rettigheder forbeholdt. ·{" "}
          <Link to="/handelsbetingelser" className="link-underline">
            Handelsbetingelser
          </Link>{" "}
          ·{" "}
          <Link to="/privatlivspolitik" className="link-underline">
            Privatlivspolitik
          </Link>
        </div>
      </div>
    </footer>
  );
}
