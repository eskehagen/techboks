import { createFileRoute } from "@tanstack/react-router";
import {
  ExternalLink,
  LegalList,
  LegalPage,
  LegalSection,
  LegalSubheading,
  LegalText,
  TextLink,
} from "@/components/LegalPage";
import { ORDER_BUTTON_LABEL } from "@/lib/orders";
import { WITHDRAWAL_LINK_LABEL } from "@/lib/withdrawal";
import { pageHead } from "@/seo/head";
import { webPage } from "@/seo/schema";
import { SITE } from "@/seo/site";

/**
 * Handelsbetingelser for forbrugerkøb.
 *
 * Reglerne om fortrydelsesret (forbrugeraftaleloven) og reklamation (købeloven)
 * kan ikke fraviges til skade for forbrugeren, så skriv aldrig kortere frister
 * eller færre rettigheder end her. Ret datoen herunder, når teksten ændres.
 */
const UPDATED = { iso: "2026-09-29", text: "29. september 2026" };

export const Route = createFileRoute("/handelsbetingelser")({
  head: () => {
    const path = "/handelsbetingelser";
    const title = "Handelsbetingelser – levering og reklamation | TechBoks";
    const description =
      "TechBoks' handelsbetingelser: betaling med MobilePay eller bankoverførsel, levering på 3–7 hverdage, 14 dages fortrydelsesret og 2 års reklamationsret.";
    return pageHead({
      path,
      title,
      description,
      graph: [webPage({ path, title, description, dateModified: UPDATED.iso })],
    });
  },
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      eyebrow="Handelsbetingelser"
      title="Vilkår for køb hos TechBoks"
      intro="Her kan du læse om priser, betaling, levering, fortrydelsesret og reklamation, før du bestiller."
      updated={UPDATED.text}
      contactText="Kontakt mig gerne, hvis du har spørgsmål til handelsbetingelserne."
    >
      <LegalSection id="saelger" title="Sælger" index={0}>
        <LegalList
          items={[
            `${SITE.name} drives af ${SITE.owner.name}.`,
            ...(SITE.address ? [`Adresse: ${SITE.address}.`] : []),
            <>
              E-mail og kontaktformular finder du på <TextLink to="/kontakt">kontaktsiden</TextLink>
              . Du får normalt svar inden for 24 timer.
            </>,
            `${SITE.name} har intet CVR-nummer og er ikke momsregistreret.`,
          ]}
        />
      </LegalSection>

      <LegalSection id="priser" title="Priser" index={1}>
        <LegalList
          items={[
            `Alle priser er i danske kroner. ${SITE.name} er ikke momsregistreret, så der er ingen moms i priserne.`,
            `Fragt kommer oveni og afhænger af pakkens vægt. Du ser den samlede pris med fragt, før du bestiller. Afhentning i ${SITE.pickup} er gratis.`,
            "Priser og produkter kan ændre sig, men prisen i din ordrebekræftelse er den, du betaler.",
          ]}
        />
      </LegalSection>

      <LegalSection id="bestilling" title="Bestilling og aftale" index={2}>
        <LegalList
          items={[
            "Alle produkter printes efter bestilling.",
            `Du bestiller ved at lægge varer i kurven, udfylde dine oplysninger og trykke »${ORDER_BUTTON_LABEL}«. Der er ingen online betaling.`,
            "Du får straks en ordrebekræftelse på mail med ordrens indhold, den samlede pris og betalingsoplysninger. Aftalen er indgået, når du har fået ordrebekræftelsen. Tjek den, og skriv hurtigst muligt, hvis noget er forkert.",
            <>
              Indtil du trykker »{ORDER_BUTTON_LABEL}«, kan du rette dine oplysninger og ændre
              kurven. Aftalen indgås på dansk. Ordrebekræftelsen er din kopi af aftalen, og{" "}
              {SITE.name} gemmer ordren som beskrevet i{" "}
              <TextLink to="/privatlivspolitik">privatlivspolitikken</TextLink>.
            </>,
            "Skriver du et ønske i feltet Bemærkninger, som ikke kan opfyldes, får du besked, før der bliver printet, og du kan annullere ordren uden omkostninger.",
            `Specialopgaver, fx en vare efter dine egne mål eller med din egen tekst, aftales direkte med ${SITE.name}, før du bestiller. Du får et tilbud på mail, og aftalen er indgået, når du har sagt ja til det.`,
          ]}
        />
      </LegalSection>

      <LegalSection id="betaling" title="Betaling" index={3}>
        <LegalList
          items={[
            `Du betaler med ${SITE.payment}. MobilePay-nummeret står i ordrebekræftelsen. Vil du hellere betale med bankoverførsel, så svar på mailen, og du får kontooplysningerne.`,
            "Skal ordren sendes, skal betalingen være modtaget, før den sendes. Henter du ordren, kan du også betale, når du henter den.",
            `Er en ordre, der skal sendes, ikke betalt 14 dage efter ordrebekræftelsen, kan ${SITE.name} annullere den. Det samme gælder en ordre til afhentning, der ikke er hentet 14 dage efter, at du har fået besked om, at den er klar. Har du allerede betalt, får du pengene tilbage.`,
            `Ved specialopgaver kan ${SITE.name} kræve betaling, før produktionen går i gang.`,
          ]}
        />
      </LegalSection>

      <LegalSection id="levering" title="Levering" index={4}>
        <LegalList
          items={[
            `Leveringstiden er ${SITE.deliveryTime} fra ordrebekræftelsen. Skal ordren sendes, regnes den fra den dag, betalingen er modtaget.`,
            `Ordrer sendes med DAO eller GLS til hele ${SITE.country.name}, eller du kan hente dem gratis i ${SITE.pickup} efter aftale.`,
            "Risikoen for varen går over til dig, når du har modtaget eller hentet den.",
            "Oplys en korrekt leveringsadresse. Kommer pakken retur, fordi adressen er forkert, betaler du for at få den sendt igen.",
            `Bliver din ordre forsinket, giver ${SITE.name} besked hurtigst muligt. Dine rettigheder efter købeloven ved forsinkelse gælder altid.`,
          ]}
        />
      </LegalSection>

      <LegalSection id="fortrydelsesret" title="Fortrydelsesret" index={5}>
        <LegalList
          items={[
            "Du har 14 dages fortrydelsesret, når du køber på techboks.dk. Fristen løber fra den dag, du modtager eller henter varen. Får du varer fra samme ordre på forskellige dage, løber fristen fra den dag, du får den sidste.",
            "Du kan også fortryde, før du har fået varen.",
            <>
              Vil du fortryde, så brug <TextLink to="/fortryd">»{WITHDRAWAL_LINK_LABEL}«</TextLink>,
              som du finder nederst på alle sider, inden fristen udløber. Så får du straks en
              kvittering på mail. Du kan også give {SITE.name} besked på anden tydelig måde, fx på
              e-mail via <TextLink to="/kontakt">kontaktsiden</TextLink>, eller bruge
              fortrydelsesformularen herunder. Det er ikke nok bare at sende varen retur uden at
              give besked.
            </>,
            `Send varen retur senest 14 dage efter, at du har givet besked. Du betaler selv returfragten og skal pakke varen forsvarligt. Bor du i nærheden, kan du i stedet aflevere den i ${SITE.pickup} efter aftale.`,
            `Du får hele købsbeløbet tilbage, også den fragt, du betalte for at få varen sendt, senest 14 dage efter, at ${SITE.name} har fået din besked. ${SITE.name} må vente med at betale tilbage, til varen er kommet retur, eller du har vist, at den er sendt. Pengene sendes samme vej, som du betalte, medmindre andet aftales.`,
            "Du må gerne prøve varen, fx sætte den på plads i bilen for at se, om den passer, ligesom du ville i en butik. Har du håndteret varen mere end det, og er den derfor faldet i værdi, kan beløbet blive nedsat med værdiforringelsen.",
          ]}
        />
        <LegalSubheading>Undtagelser</LegalSubheading>
        <LegalText>
          Fortrydelsesretten gælder ikke for varer, der er lavet efter dine egne specifikationer
          eller har fået et tydeligt personligt præg, fx en vare efter dine egne mål, med din egen
          tekst eller et design, du har bestilt særskilt (forbrugeraftalelovens § 18, stk. 2, nr.
          3). Vælger du mellem mulighederne på produktsiden, fx farve, årgang, mønster eller side,
          eller skriver du et farveønske i feltet Bemærkninger, er varen ikke en specialvare. Er din
          vare undtaget, står det i tilbuddet, før du siger ja.
        </LegalText>
        <LegalSubheading>Fortrydelsesformular</LegalSubheading>
        <WithdrawalForm />
      </LegalSection>

      <LegalSection id="reklamation" title="Reklamation" index={6}>
        <LegalList
          items={[
            "Du har 2 års reklamationsret efter købeloven. Den dækker fejl og mangler, der var der, da du fik varen, også selvom de først viser sig senere.",
            "Reklamér inden rimelig tid, efter du har opdaget fejlen. Reklamerer du inden 2 måneder efter, at du har opdaget fejlen, er det altid rettidigt.",
            <>
              Skriv til {SITE.name} via <TextLink to="/kontakt">kontaktsiden</TextLink>, beskriv
              fejlen, og send gerne et billede.
            </>,
            `Er varen mangelfuld, kan du vælge mellem at få den repareret eller få en ny, medmindre det er umuligt eller urimeligt dyrt for ${SITE.name}.`,
            `Du kan i stedet få et forholdsmæssigt afslag i prisen eller hæve købet og få pengene tilbage, hvis ${SITE.name} ikke retter fejlen inden rimelig tid eller afviser at gøre det, hvis fejlen er der stadig efter en reparation eller ombytning, eller hvis fejlen er så alvorlig, at du ikke skal vente på en reparation. Er fejlen uvæsentlig, kan du dog ikke hæve købet.`,
            `Send varen retur efter aftale, og pak den forsvarligt. Ved en berettiget reklamation dækker ${SITE.name} dine rimelige udgifter til returfragt.`,
            "Reklamationsretten dækker ikke almindeligt slid, forkert brug, uheld eller ændringer, du selv har lavet på varen.",
          ]}
        />
      </LegalSection>

      <LegalSection id="ansvar" title="Produktansvar og ansvar" index={7}>
        <LegalList
          items={[
            "Produkterne er lavet med omhu, men 3D-printede produkter kan have små variationer i finish og præcision.",
            "Brug produkterne efter hensigten og som beskrevet på produktsiden.",
            `${SITE.name} hæfter ikke for indirekte tab eller følgeskader, medmindre andet følger af ufravigelige regler, fx i købeloven eller produktansvarsloven.`,
            `${SITE.name} er ikke ansvarlig for forsinkelser, der skyldes forhold uden for ${SITE.name}' kontrol, fx strejke, brand, krig eller naturkatastrofer.`,
          ]}
        />
      </LegalSection>

      <LegalSection id="persondata" title="Persondata og cookies" index={8}>
        <LegalList
          items={[
            <>
              {SITE.name} bruger kun dine oplysninger til at behandle din ordre og svare på dine
              henvendelser. Læs mere i{" "}
              <TextLink to="/privatlivspolitik">privatlivspolitikken</TextLink>.
            </>,
            "Sitet sætter ingen cookies.",
          ]}
        />
      </LegalSection>

      <LegalSection id="ophavsret" title="Ophavsret" index={9}>
        <LegalList
          items={[
            "Alle produktdesigns, billeder og beskrivelser på sitet er beskyttet af ophavsret og må ikke kopieres eller bruges uden tilladelse.",
            "Køb af et produkt giver ikke ret til at kopiere, genskabe eller videresælge designet.",
          ]}
        />
      </LegalSection>

      <LegalSection id="klage" title="Klage" index={10}>
        <LegalList
          items={[
            `Er du utilfreds med dit køb, så skriv til ${SITE.name} først. De fleste ting kan løses hurtigt.`,
            <>
              Finder du og {SITE.name} ikke en løsning, kan du klage til Nævnenes Hus,
              Mæglingsteamet for Forbrugerklager, Toldboden 2, 8800 Viborg,{" "}
              <ExternalLink href="https://naevneneshus.dk">naevneneshus.dk</ExternalLink>. Du klager
              via Klageportalen for Nævnenes Hus.
            </>,
            `Før du kan klage dér, skal du have klaget til ${SITE.name}, og prisen på den vare, du klager over, skal som udgangspunkt være mellem 1.220 og 100.000 kr. Der er et gebyr for at klage, og beløbsgrænserne kan ændre sig.`,
            "Dansk ret gælder for alle køb.",
          ]}
        />
      </LegalSection>
    </LegalPage>
  );
}

/**
 * Standardfortrydelsesformularen fra forbrugeraftalelovens bilag 3, ordret.
 * Samme tekst står i ordrebekræftelsen (mail_scripts/google-apps-script-updated.gs).
 */
function WithdrawalForm() {
  const recipient = [
    `${SITE.name} v/ ${SITE.owner.name}`,
    SITE.address,
    "e-mail: se techboks.dk/kontakt",
  ]
    .filter(Boolean)
    .join(", ");

  const fields = [
    "Bestilt den (*)/modtaget den (*)",
    "Forbrugerens navn (Forbrugernes navne)",
    "Forbrugerens adresse (Forbrugernes adresse)",
    "Forbrugerens underskrift (Forbrugernes underskrifter) (kun hvis formularens indhold meddeles på papir)",
    "Dato",
  ];

  return (
    <div className="bg-canvas text-muted-foreground rounded-3xl p-6 text-sm leading-relaxed sm:p-8">
      <p className="text-ink font-semibold">Standardfortrydelsesformular</p>
      <p className="mt-1 text-xs">
        (denne formular udfyldes og returneres kun, hvis fortrydelsesretten gøres gældende)
      </p>
      <p className="mt-5">
        <span className="text-ink font-medium">Til:</span> {recipient}
      </p>
      <p className="mt-3">
        Jeg/vi (*) meddeler herved, at jeg/vi (*) ønsker at gøre fortrydelsesretten gældende i
        forbindelse med min/vores (*) købsaftale om følgende varer (*)/levering af følgende
        tjenesteydelser (*)
      </p>
      <div className="border-ink/25 mt-3 h-6 border-b border-dotted" aria-hidden="true" />
      <dl className="mt-2">
        {fields.map((field) => (
          <div
            key={field}
            className="border-ink/25 flex items-end gap-3 border-b border-dotted py-3"
          >
            <dt>{field}:</dt>
            <dd className="flex-1" />
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs">(*) Det ikke relevante udstreges</p>
    </div>
  );
}
