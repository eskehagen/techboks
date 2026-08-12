import { Link } from "@tanstack/react-router";
import { categories } from "@/data/products";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="px-3 pb-3">
      <div className="rounded-blob-lg bg-ink text-canvas mt-6 p-7 sm:p-12">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div className="max-w-md">
            <div className="bg-canvas inline-flex rounded-full px-4 py-2">
              <Logo />
            </div>
            <p className="font-display mt-8 text-3xl leading-[1.05] font-semibold tracking-tight sm:text-4xl">
              Dansk designet.
              <br />
              Printet i små serier.
            </p>
            <p className="text-canvas/55 mt-5 max-w-sm text-sm leading-relaxed">
              Produkter der løser konkrete hverdagsproblemer — tegnet fra bunden, målt op og
              printet i vores eget værksted.
            </p>
          </div>

          <div>
            <h3 className="text-canvas/45 text-[11px] tracking-[0.2em] uppercase">Kategorier</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/produkter"
                    search={{ kategori: c.slug, q: "" }}
                    className="link-underline text-canvas/80"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/produkter" search={{ kategori: "alle", q: "" }} className="link-underline text-canvas/80">
                  Alle produkter
                </Link>
              </li>
              <li>
                <Link to="/om" className="link-underline text-canvas/80">
                  Om TechBoks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-canvas/45 text-[11px] tracking-[0.2em] uppercase">Kontakt</h3>
            <ul className="text-canvas/80 mt-5 space-y-3 text-sm">
              <li><Link to="/kontakt" className="link-underline">Kontakt &amp; bestilling</Link></li>
              <li>info@techboks.dk</li>
              <li>Betaling via MobilePay</li>
              <li>Fragt med GLS / PostNord</li>
            </ul>
          </div>
        </div>

        <div className="border-canvas/15 text-canvas/45 mt-12 flex flex-wrap items-center justify-between gap-2 border-t pt-6 text-xs">
          <span>© {new Date().getFullYear()} TechBoks — printet i Danmark</span>
          <span>
            CVR ·{" "}
            <Link to="/handelsbetingelser" className="link-underline">
              Handelsbetingelser
            </Link>{" "}
            · Privatlivspolitik
          </span>
        </div>
      </div>
    </footer>
  );
}
