import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/handelsbetingelser")({
  head: () => ({
    meta: [
      { title: "Handelsbetingelser — TechBoks" },
      {
        name: "description",
        content: "Vilkår for køb, betaling, levering, fortrydelsesret og reklamation hos TechBoks.",
      },
      { property: "og:title", content: "Handelsbetingelser — TechBoks" },
      {
        property: "og:description",
        content: "Læs om vilkår for køb og levering hos TechBoks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

const sections: { title: string; items: string[] }[] = [
  {
    title: "Generelle betingelser",
    items: [
      "Alle produkter er 3D printede og fremstilles efter behov og bestilling.",
      "Ved bestilling accepterer du disse handelsbetingelser.",
      "Priser er angivet i danske kroner (DKK) inklusiv moms, men eksklusiv fragt medmindre andet er angivet.",
      "TechBoks forbeholder sig ret til prisændringer og ændringer i produktspecifikationer uden forudgående varsel.",
    ],
  },
  {
    title: "Bestilling og bekræftelse",
    items: [
      "Bestillinger skal bekræftes skriftligt via email eller besked.",
      "En ordre er først bindende når der modtages en ordrebekræftelse fra TechBoks.",
    ],
  },
  {
    title: "Betaling",
    items: [
      "Betaling kan ske via MobilePay eller bankoverførsel.",
      "Betaling skal være modtaget før ordren sendes eller kan afhentes.",
      "Ved manglende betaling forbeholdes retten til at annullere ordren og beregne et gebyr for allerede påbegyndt produktion.",
    ],
  },
  {
    title: "Levering",
    items: [
      "Der tilstræbes 3-7 hverdages leveringstid. Leveringstiden kan variere afhængigt af produktets kompleksitet og lagerstatus.",
      "Leveringstider er vejledende og ikke garanterede. Forsinkelser giver ikke ret til annullering eller erstatning.",
      "Det er både muligt at afhente produkter personligt efter aftale, eller få dem sendt med posten. Fragtomkostninger tilkommer ved forsendelse.",
      "Risikoen for produktet overgår til køber ved levering/afhentning. Ved forsendelse sker det når produktet afleveres til transportøren.",
      "Køber er ansvarlig for at angive korrekt leveringsadresse. Ekstra omkostninger ved fejlagtige adresser afholdes af køber.",
    ],
  },
  {
    title: "Fortrydelsesret og returnering",
    items: [
      "Da produkterne er specialfremstillede, er fortrydelsesretten som udgangspunkt frafaldet jf. forbrugeraftalelovens § 18, stk. 2, nr. 3.",
      "Der ydes ingen returret på specialdesignede eller personaliserede produkter, medmindre produktet er defekt ved modtagelse.",
      "Ved modtagelse af defekte eller fejlagtige produkter kontakt TechBoks straks. Der vil blive fundet en løsning i form af ombytning eller refusion.",
    ],
  },
  {
    title: "Reklamation og garanti",
    items: [
      "Ved reklamationer bedes køber kontakte TechBoks inden for 14 dage efter modtagelse af produktet.",
      "Der gives 2 års reklamationsret på produktfejl og mangler jf. købeloven.",
      "Reklamationsretten dækker ikke skader opstået ved forkert brug, almindeligt slid, uheld eller ændringer foretaget af køber.",
      "Ved berettiget reklamation vil produktet blive repareret, ombytet eller pengene refunderet efter TechBoks' vurdering.",
      "Returnering ved reklamation skal ske i holdbar emballage og forsvarlig indpakning. Returomkostninger afholdes af køber, men refunderes ved berettiget reklamation.",
    ],
  },
  {
    title: "Produktansvar og ansvarsfraskrivelse",
    items: [
      "Produkterne er fremstillet med omhu, men 3D-printede produkter kan have mindre variationer i finish og præcision.",
      "TechBoks er ikke ansvarlig for indirekte tab, driftstab eller følgeskader ved brug af produkterne.",
      "Produkter skal bruges efter hensigten. TechBoks påtager sig intet ansvar for skader ved forkert anvendelse.",
      "TechBoks er ikke ansvarlig for forsinkelser eller manglende levering som følge af force majeure, herunder strejke, lockout, brand, krig, naturkatastrofer eller lignende.",
    ],
  },
  {
    title: "Persondata og GDPR",
    items: [
      "Dine personoplysninger behandles fortroligt og kun til brug for ordrens gennemførelse.",
      "Kun nødvendige oplysninger (navn, adresse, email, telefon) opbevares og deles dem ikke med tredjeparter.",
      "Køber har ret til indsigt, rettelse og sletning af dine personoplysninger. Kontakt TechBoks for udøvelse af disse rettigheder.",
    ],
  },
  {
    title: "Immaterielle rettigheder",
    items: [
      "Alle produktdesigns, billeder og beskrivelser på hjemmesiden er beskyttet af ophavsret og må ikke kopieres eller anvendes uden tilladelse.",
      "Køb af et produkt giver ikke ret til at kopiere, reproducere eller videresælge designet.",
    ],
  },
  {
    title: "Tvistløsning",
    items: [
      "Eventuelle tvister søges løst i mindelighed. Kan der ikke opnås enighed, kan sagen indbringes for Konkurrence- og Forbrugerstyrelsens Center for Klageløsning (www.forbrug.dk).",
      "Dansk ret finder anvendelse på alle handler.",
    ],
  },
];

function TermsPage() {
  return (
    <div className="px-3 pb-20">
      {/* Hero */}
      <section className="rounded-blob-lg bg-ink text-canvas relative mt-3 overflow-hidden px-6 py-16 sm:px-12 sm:py-24">
        <div className="relative max-w-3xl">
          <span className="text-canvas/50 text-[11px] tracking-[0.25em] uppercase">
            Handelsbetingelser
          </span>
          <h1 className="font-display mt-5 text-4xl leading-[1.02] font-semibold tracking-tight sm:text-6xl">
            Vilkår for køb hos TechBoks
          </h1>
          <p className="text-canvas/60 mt-6 max-w-xl text-base leading-relaxed">
            Læs om vilkår for køb, betaling, levering og reklamation, før du bestiller.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="mx-auto mt-3 max-w-[70rem] space-y-3">
        {sections.map((section, i) => (
          <Reveal key={section.title} delay={Math.min(i * 0.04, 0.3)}>
            <div className="rounded-blob-lg bg-surface p-7 sm:p-10">
              <h2 className="font-display text-ink text-2xl font-semibold tracking-tight sm:text-3xl">
                {section.title}
              </h2>
              <ul className="mt-6 space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-mint-foreground" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Contact CTA */}
      <section className="mx-auto mt-3 max-w-[70rem]">
        <Reveal>
          <div className="rounded-blob-lg bg-ink text-canvas p-7 text-center sm:p-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Har du spørgsmål?
            </h2>
            <p className="text-canvas/65 mx-auto mt-3 max-w-md text-sm leading-relaxed">
              Kontakt mig gerne, hvis du har spørgsmål til handelsbetingelserne.
            </p>
            <Link
              to="/kontakt"
              className="bg-canvas text-ink mt-6 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-transform hover:scale-[1.03]"
            >
              Gå til kontakt
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
