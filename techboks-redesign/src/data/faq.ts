/**
 * Spørgsmål og svar — vises på /faq og bruges til FAQPage-JSON-LD og llms.txt.
 *
 * Sådan tilføjer du et spørgsmål:
 *  1. Find den kategori, det hører til, eller lav en ny { id, title, items }.
 *     id bruges i adressen (/faq#levering), så kun små bogstaver og bindestreg.
 *  2. Tilføj { q: "Spørgsmålet?", a: "Svaret." } under items.
 *  3. Svaret skal kunne stå alene i 2–4 sætninger: AI-assistenter og Google
 *     citerer ét svar ad gangen, uden resten af siden.
 *  4. Kun fakta, der også står andre steder på sitet. Ingen links eller HTML i
 *     svaret — teksten bruges ordret i de strukturerede data.
 *  5. Ret `updated` i src/seo/site.ts, og kør `npm run validate`.
 */

import { products } from "@/data/products";
import { ORDER_BUTTON_LABEL } from "@/lib/orders";
import { WITHDRAWAL_LINK_LABEL } from "@/lib/withdrawal";
import { TIERS } from "@/lib/shipping";
import { SITE } from "@/seo/site";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

const cheapest = Math.min(...products.map((p) => p.price));

const weight = (grams: number) =>
  grams < 1000 ? `${grams} g` : `${(grams / 1000).toLocaleString("da-DK")} kg`;
const heaviest = TIERS[TIERS.length - 1]!.maxGrams;
const tiers = TIERS.map((t) => `${t.price} kr. op til ${weight(t.maxGrams)}`);
const tierList = `${tiers.slice(0, -1).join(", ")} og ${tiers.at(-1)}`;

export const FAQ: FaqCategory[] = [
  {
    id: "bestilling",
    title: "Bestilling og betaling",
    items: [
      {
        q: "Hvordan bestiller jeg?",
        a: `Læg produkterne i kurven, udfyld dine oplysninger, og tryk »${ORDER_BUTTON_LABEL}«. Der er ingen online betaling. Du får straks en ordrebekræftelse på mail med den samlede pris inkl. fragt og betalingsoplysningerne.`,
      },
      {
        q: "Hvordan betaler jeg?",
        a: `Du betaler med ${SITE.payment}, når du har fået ordrebekræftelsen på mail. Skal ordren sendes, skal betalingen være modtaget, før den sendes. Henter du ordren, kan du også betale ved afhentning.`,
      },
      {
        q: "Hvad koster produkterne?",
        a: `Priserne står på hver produktside i danske kroner og starter ved ${cheapest} kr. TechBoks er ikke momsregistreret, så der er ingen moms i priserne. Fragten kommer oveni og afhænger af pakkens vægt, mens afhentning i ${SITE.pickup} er gratis.`,
      },
    ],
  },
  {
    id: "levering",
    title: "Levering og afhentning",
    items: [
      {
        q: "Hvor lang er leveringstiden?",
        a: `Leveringstiden er ${SITE.deliveryTime} fra ordrebekræftelsen. Skal ordren sendes, regnes den fra den dag, betalingen er modtaget. Alle produkter printes efter bestilling.`,
      },
      {
        q: "Hvad koster fragten?",
        a: `Fragten afhænger af pakkens samlede vægt: ${tierList}. Ordrer over ${weight(heaviest)} kan kun afhentes. Du ser fragtprisen, før du bestiller.`,
      },
      {
        q: "Kan jeg hente min ordre?",
        a: `Ja. Vælg afhentning, når du bestiller, så aftaler vi et tidspunkt for afhentning i ${SITE.pickup}. Afhentning er gratis.`,
      },
      {
        q: "Sender TechBoks til hele Danmark?",
        a: `Ja. Ordrer sendes med DAO eller GLS til hele Danmark, eller de kan afhentes i ${SITE.pickup} efter aftale.`,
      },
    ],
  },
  {
    id: "produkter",
    title: "Produkter og pasform",
    items: [
      {
        q: "Passer produkterne til min årgang af Mustang Mach-E?",
        a: "Ja. Center Konsol Boks findes i to udgaver, fordi midterkonsollen fik ny form med 2025-modellen: én til 2021–2024 og én til 2025 og nyere, så vælg årgang, når du bestiller. Alle andre produkter passer til alle årgange af Mustang Mach-E.",
      },
      {
        q: "Hvilket materiale er produkterne lavet af?",
        a: "De fleste produkter printes i PETG, som tåler varme, kulde og vibrationer. Dele, der skal være simple og præcise, printes i PLA, som er bionedbrydeligt. Produktionen kører på grøn strøm.",
      },
      {
        q: "Kan jeg vælge farve?",
        a: "Ja. Hvor produktsiden har et farvevalg, vælger du farven på logo og detaljer blandt hvid, rød, blå og grøn, og Homey Pro Cover fås i sort, hvid, grå, rød, blå og grøn. Har du et andet farveønske, så skriv det i feltet Bemærkninger, når du bestiller.",
      },
      {
        q: "Hvordan monteres produkterne?",
        a: "Det afhænger af produktet: Center Konsol Boks sættes ned i rummet under armlænet, skraldespanden monteres i sidedørens udformning, bagagerumskrogene på Isofix-beslaget og skillerummene med velcro. Mere om det enkelte produkt står under Specifikationer på produktsiden.",
      },
      {
        q: "Kan jeg få lavet et specialønske?",
        a: `Ja. Farver, mål og detaljer kan tilpasses. Skriv via kontaktformularen, på mail eller på Instagram, så vender ${SITE.owner.name} tilbage inden for 24 timer.`,
      },
    ],
  },
  {
    id: "kontakt",
    title: "Fortrydelse, reklamation og kontakt",
    items: [
      {
        q: "Kan jeg fortryde mit køb?",
        a: `Ja. Du har 14 dages fortrydelsesret fra den dag, du modtager eller henter varen. Brug »${WITHDRAWAL_LINK_LABEL}« nederst på siden, inden fristen udløber, så får du straks en kvittering på mail. Send varen retur senest 14 dage efter, at du har givet besked; du betaler selv returfragten og får hele købsbeløbet tilbage inkl. den oprindelige fragt. Varer lavet efter dine egne mål, med din egen tekst eller dit eget design er undtaget.`,
      },
      {
        q: "Hvad gør jeg, hvis et produkt er defekt?",
        a: "Skriv til TechBoks, beskriv fejlen, og send gerne et billede. Du vælger selv, om du vil have varen repareret eller få en ny, og kan fejlen ikke rettes, kan du få afslag i prisen eller pengene tilbage. Der er 2 års reklamationsret efter købeloven, og reklamerer du inden 2 måneder efter, at du har opdaget fejlen, er det altid rettidigt.",
      },
      {
        q: "Hvordan kontakter jeg TechBoks?",
        a: "Skriv via kontaktformularen på siden Kontakt, send en mail eller en besked på Instagram. Du får svar inden for 24 timer.",
      },
      {
        q: "Hvem står bag TechBoks?",
        a: `TechBoks drives af ${SITE.owner.name}, som selv tegner, måler op og 3D-printer alle produkterne i små serier i Danmark.`,
      },
    ],
  },
  {
    id: "privatliv",
    title: "Privatliv og cookies",
    items: [
      {
        q: "Bruger techboks.dk cookies?",
        a: "Nej. Sitet sætter ingen cookies, og der er ingen cookie-pop-up. Kurven gemmes kun i din egen browser, og besøgsstatistikken tæller sidevisninger uden cookies.",
      },
      {
        q: "Hvad bruger TechBoks mine oplysninger til?",
        a: "Kun til at behandle din ordre og svare på dine beskeder. Oplysningerne bliver aldrig solgt eller brugt til markedsføring. Du kan læse mere i privatlivspolitikken.",
      },
    ],
  },
];
