import { createFileRoute } from "@tanstack/react-router";
import {
  ExternalLink,
  LegalFacts,
  LegalList,
  LegalPage,
  LegalSection,
  LegalSubheading,
  LegalText,
  TextLink,
} from "@/components/LegalPage";
import { pageHead } from "@/seo/head";
import { webPage } from "@/seo/schema";
import { SITE } from "@/seo/site";

/**
 * Privatlivspolitik (GDPR artikel 13).
 *
 * Skal passe med virkeligheden. Tager du en ny tjeneste i brug, der får
 * kundedata (fx et nyhedsbrev, et fragtsystem eller et andet ordresystem), så
 * skriv den på listen under "Hvem får dine oplysninger?" og ret datoen herunder.
 */
const UPDATED = { iso: "2026-09-29", text: "29. september 2026" };

export const Route = createFileRoute("/privatlivspolitik")({
  head: () => {
    const path = "/privatlivspolitik";
    const title = "Privatlivspolitik – persondata og cookies | TechBoks";
    const description =
      "Sådan behandler TechBoks dine personoplysninger ved bestilling og kontakt: hvem der modtager dem, hvor længe de gemmes, og dine rettigheder. Ingen cookies.";
    return pageHead({
      path,
      title,
      description,
      graph: [webPage({ path, title, description, dateModified: UPDATED.iso })],
    });
  },
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privatlivspolitik"
      title="Sådan behandler jeg dine oplysninger"
      intro="Her kan du læse, hvilke oplysninger jeg behandler, når du bestiller, fortryder et køb eller skriver til mig, hvem der ser dem, og hvilke rettigheder du har. Kort fortalt: dine oplysninger bruges kun til at svare dig og levere din ordre, og sitet sætter ingen cookies."
      updated={UPDATED.text}
      contactText="Skriv til mig, hvis du har spørgsmål til, hvordan dine oplysninger bliver behandlet."
    >
      <LegalSection id="dataansvarlig" title="Hvem er dataansvarlig?" index={0}>
        <LegalList
          items={[
            `${SITE.name} drives af ${SITE.owner.name} (»jeg« på denne side), som er dataansvarlig for de personoplysninger, der behandles via techboks.dk.`,
            ...(SITE.address ? [`Adresse: ${SITE.address}.`] : []),
            <>
              Du kontakter mig på e-mail eller via formularen på{" "}
              <TextLink to="/kontakt">kontaktsiden</TextLink>. Jeg svarer normalt inden for 24
              timer.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection id="bestilling" title="Når du bestiller" index={1}>
        <LegalFacts
          rows={[
            {
              label: "Oplysninger",
              value:
                "Navn, e-mail, telefonnummer, adresse (kun når ordren skal sendes), dine bemærkninger, de varer, du bestiller, og hvordan du betaler.",
            },
            {
              label: "Formål",
              value:
                "At bekræfte, printe og sende eller udlevere din ordre, tage imod betalingen og håndtere en eventuel fortrydelse eller reklamation.",
            },
            {
              label: "Retsgrundlag",
              value:
                "Oplysningerne er nødvendige for at opfylde købsaftalen med dig (databeskyttelsesforordningens artikel 6, stk. 1, litra b). Oplysninger om gennemførte køb gemmes for at overholde regler om regnskab og skat (litra c) og for at kunne dokumentere handlen ved en reklamation (litra f).",
            },
            {
              label: "Opbevaring",
              value:
                "Gennemførte køb gemmer jeg i 5 år fra udgangen af det år, du købte. Ordrer, der aldrig bliver betalt, sletter jeg senest ved udgangen af året efter.",
            },
            {
              label: "Skal du oplyse dem?",
              value:
                "Ja, navn, e-mail og telefonnummer, og adressen, hvis ordren skal sendes. Uden dem kan jeg ikke behandle ordren.",
            },
          ]}
        />
      </LegalSection>

      <LegalSection id="kontakt" title="Når du skriver til mig" index={2}>
        <LegalFacts
          rows={[
            {
              label: "Oplysninger",
              value:
                "Navn, e-mail, telefonnummer, hvis du skriver det, emne og selve beskeden. Det gælder både kontaktformularen, e-mail og beskeder på Instagram.",
            },
            {
              label: "Formål",
              value: "At svare på dit spørgsmål eller dit specialønske.",
            },
            {
              label: "Retsgrundlag",
              value:
                "Min legitime interesse i at kunne svare dig (artikel 6, stk. 1, litra f). Handler beskeden om et køb, er grundlaget aftalen med dig (litra b).",
            },
            {
              label: "Opbevaring",
              value:
                "Beskeder, der ikke fører til et køb, sletter jeg senest ved udgangen af året efter, du skrev. Fører beskeden til et køb, gemmes den sammen med ordren.",
            },
          ]}
        />
        <LegalText>
          Skriver du til mig på Instagram, behandler Meta også beskeden efter Metas egne regler.
        </LegalText>
      </LegalSection>

      <LegalSection id="fortrydelse" title="Når du fortryder et køb" index={3}>
        <LegalFacts
          rows={[
            {
              label: "Oplysninger",
              value:
                "Navn, e-mail, ordrenummer, de varer, du fortryder, og tidspunktet for din fortrydelse. Det gælder både »Fortryd aftale« på sitet og fortrydelser på e-mail.",
            },
            {
              label: "Formål",
              value:
                "At registrere din fortrydelse, sende dig en kvittering og betale dig pengene tilbage.",
            },
            {
              label: "Retsgrundlag",
              value:
                "Loven kræver, at jeg tager imod din fortrydelse og sender dig en kvittering (artikel 6, stk. 1, litra c). Behandlingen er også nødvendig for at afvikle købsaftalen med dig (litra b).",
            },
            {
              label: "Opbevaring",
              value: "Fortrydelsen gemmes sammen med ordren og slettes samtidig med den.",
            },
          ]}
        />
      </LegalSection>

      <LegalSection id="besoeg" title="Når du besøger sitet" index={4}>
        <LegalSubheading>Drift af sitet</LegalSubheading>
        <LegalText>
          Sitet drives hos Vercel. Som hos alle webhoteller modtager Vercel din IP-adresse,
          oplysninger om din browser og den side, du beder om, for at kunne vise siden og beskytte
          sitet mod misbrug. Oplysningerne ligger kun kort tid i Vercels tekniske logs. Grundlaget
          er min legitime interesse i et stabilt og sikkert site (artikel 6, stk. 1, litra f).
        </LegalText>
        <LegalSubheading>Besøgsstatistik</LegalSubheading>
        <LegalText>
          Jeg tæller sidevisninger med Vercel Web Analytics for at se, hvilke sider og produkter der
          bliver brugt. Statistikken registrerer tidspunktet, siden, den side du kom fra, omtrentlig
          placering (land, region og by), enhedstype, styresystem og browser. Den bruger ingen
          cookies og gemmer intet på din enhed. Besøgende skelnes med en kode, der beregnes ud fra
          forespørgslen og slettes efter 24 timer, så jeg kan ikke se, hvem du er, eller følge dig
          fra dag til dag. Grundlaget er min legitime interesse i at forbedre sitet (litra f).
        </LegalText>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies og lokal lagring" index={5}>
        <LegalList
          items={[
            "techboks.dk sætter ingen cookies, og der er ingen cookie-pop-up.",
            "Når du lægger noget i kurven, gemmes kurven i din egen browser (localStorage), så den er der, når du kommer tilbage. Det samme gælder dit valg af visning i produktkataloget. Oplysningerne sendes ikke til mig, før du selv bestiller.",
            "Når du forlader en side, husker browseren, hvor langt du havde scrollet, så du lander samme sted, hvis du går tilbage (sessionStorage). Det slettes, når du lukker fanen.",
            "Du kan slette det hele når som helst ved at rydde browserdata for techboks.dk. Kurven tømmes også, når du har bestilt.",
          ]}
        />
      </LegalSection>

      <LegalSection id="modtagere" title="Hvem får dine oplysninger?" index={6}>
        <LegalText>
          Jeg sælger aldrig dine oplysninger og bruger dem ikke til markedsføring eller nyhedsbreve.
          De deles kun med disse modtagere:
        </LegalText>
        <LegalList
          items={[
            "Google: bestillinger, fortrydelser og beskeder sendes gennem Google Apps Script og lander i min Gmail, hvor jeg også svarer dig.",
            "Airtable: ordrer og kundeoplysninger registreres i min ordreoversigt i Airtable.",
            "Vercel: driver sitet og besøgsstatistikken.",
            "DAO eller GLS: får dit navn og din adresse, og eventuelt dit telefonnummer eller din e-mail, når din ordre sendes, så de kan levere pakken og give dig besked.",
            "MobilePay eller din bank: når du betaler. De behandler betalingen som selvstændige dataansvarlige efter deres egne regler.",
            "Offentlige myndigheder, fx Skattestyrelsen, hvis loven kræver det.",
          ]}
        />
        <LegalText>
          Der træffes ingen automatiske afgørelser om dig, og der laves ingen profilering.
        </LegalText>
      </LegalSection>

      <LegalSection id="overfoersel" title="Oplysninger uden for EU" index={7}>
        <LegalText>
          Google, Airtable og Vercel er amerikanske virksomheder, så dine oplysninger kan blive
          behandlet i USA. Google og Vercel er certificeret under EU-U.S. Data Privacy Framework,
          som EU-Kommissionen har godkendt som et tilstrækkeligt beskyttelsesniveau. For Airtable
          sker overførslen efter EU-Kommissionens standardkontraktbestemmelser. Du kan få en kopi af
          dem ved at skrive til mig.
        </LegalText>
      </LegalSection>

      <LegalSection id="rettigheder" title="Dine rettigheder" index={8}>
        <LegalList
          items={[
            "Indsigt: du kan få at vide, hvilke oplysninger jeg har om dig, og få en kopi af dem.",
            "Berigtigelse: du kan få rettet oplysninger, der er forkerte.",
            "Sletning: du kan få slettet dine oplysninger, når jeg ikke længere har brug for dem, og loven ikke kræver, at jeg gemmer dem.",
            "Begrænsning: du kan i visse tilfælde få begrænset behandlingen, fx mens jeg undersøger, om oplysningerne er rigtige.",
            "Dataportabilitet: du kan få de oplysninger, du selv har givet, udleveret i et almindeligt, maskinlæsbart format.",
          ]}
        />
        <LegalSubheading>Ret til indsigelse</LegalSubheading>
        <LegalText>
          Du kan altid gøre indsigelse mod behandling, der bygger på min legitime interesse, fx
          driften af sitet, besøgsstatistikken og svar på henvendelser. Så stopper jeg, medmindre
          jeg har vægtige grunde, der går forud for dine interesser, eller behandlingen er nødvendig
          for at fastslå, gøre gældende eller forsvare et retskrav.
        </LegalText>
        <LegalText>
          Skriv til mig via <TextLink to="/kontakt">kontaktsiden</TextLink>, hvis du vil bruge dine
          rettigheder. Jeg svarer senest en måned efter, at du har skrevet.
        </LegalText>
      </LegalSection>

      <LegalSection id="klage" title="Klage til Datatilsynet" index={9}>
        <LegalText>
          Er du utilfreds med, hvordan jeg behandler dine oplysninger, så skriv gerne til mig først.
          Du kan også klage til Datatilsynet, Carl Jacobsens Vej 35, 2500 Valby, dt@datatilsynet.dk,{" "}
          <ExternalLink href="https://www.datatilsynet.dk">datatilsynet.dk</ExternalLink>.
        </LegalText>
      </LegalSection>

      <LegalSection id="aendringer" title="Ændringer" index={10}>
        <LegalText>
          Jeg opdaterer politikken, hvis behandlingen ændrer sig, fx hvis jeg tager en ny leverandør
          i brug. Datoen øverst viser, hvornår den sidst blev ændret. Handelsbetingelser for køb
          står på en <TextLink to="/handelsbetingelser">særskilt side</TextLink>.
        </LegalText>
      </LegalSection>
    </LegalPage>
  );
}
