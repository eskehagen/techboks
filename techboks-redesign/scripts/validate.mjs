/**
 * Validering af det byggede site.
 *
 * Kør med:  npm run validate
 * (bygger med nitro's node-server-preset og kører så dette script)
 *
 * Starter den byggede server lokalt og henter siderne, som en crawler gør —
 * altså den HTML, serveren sender, før JavaScript kører. Fejler med
 * exit-kode 1, hvis noget er galt.
 *
 *  1. Indhold: præcis én <h1>, nok tekst, intet indhold skjult med opacity:0
 *  2. <head>: unikke titler ≤ 60 tegn, descriptions 140–155 tegn, canonical,
 *     robots, delingsbillede
 *  3. JSON-LD: gyldigt, rigtige typer, FAQ-svar står ordret på siden
 *  4. Interne links og filer findes
 *  5. robots.txt, sitemap.xml, llms.txt, 404 og redirects fra gamle adresser
 *  6. Ejerens regler: telefon, e-mail, navne, footer-link
 *  7. Juridisk: privatlivspolitik, bestillingsknap, fortrydelsesfunktion, sælgeradresse
 */

import { spawn } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { REDIRECTS } from "../src/seo/redirects.ts";
import { SITE } from "../src/seo/site.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SERVER = join(ROOT, ".output", "server", "index.mjs");
const PORT = 4399;
const BASE = `http://127.0.0.1:${PORT}`;

let failures = 0;
let warnings = 0;
const fail = (m) => {
  console.log(`  ✗ ${m}`);
  failures++;
};
const warn = (m) => {
  console.log(`  ! ${m}`);
  warnings++;
};
const ok = (m) => console.log(`  ✓ ${m}`);
const section = (t) => console.log(`\n${t}\n`);

/* ─── Server ────────────────────────────────────────────────────── */

if (!existsSync(SERVER)) {
  console.error("Ingen build fundet. Kør `npm run validate` (bygger først).");
  process.exit(1);
}
const server = spawn(process.execPath, [SERVER], {
  env: { ...process.env, PORT: String(PORT), HOST: "127.0.0.1" },
  stdio: "ignore",
});
process.on("exit", () => server.kill());

async function waitForServer() {
  for (let i = 0; i < 100; i++) {
    try {
      await fetch(BASE + "/robots.txt");
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  throw new Error("Serveren startede ikke");
}

const local = (url) => url.replace(SITE.url, BASE);
const get = (path, init) => fetch(path.startsWith("http") ? path : BASE + path, { redirect: "manual", ...init });

/* ─── HTML-hjælpere ─────────────────────────────────────────────── */

const decode = (s) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

const head = (html) => html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
const visibleText = (html) =>
  decode(
    (html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? "")
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<style[\s\S]*?<\/style>/g, " ")
      .replace(/<svg[\s\S]*?<\/svg>/g, " ")
      .replace(/<[^>]*>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
const meta = (html, key) =>
  decode(
    head(html).match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`))?.[1] ?? "",
  );
const jsonLdBlocks = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);

/* ─── Kør ───────────────────────────────────────────────────────── */

await waitForServer();

const sitemap = await (await get("/sitemap.xml")).text();
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1]));
const pages = [];
for (const url of sitemapUrls) {
  const res = await get(local(url));
  pages.push({ url, path: new URL(url).pathname, status: res.status, html: await res.text() });
}

/* 1. Indhold */
section("1. Indhold i server-HTML'en (det en crawler ser uden JavaScript)");
for (const p of pages) {
  const text = visibleText(p.html);
  const words = text.split(" ").filter(Boolean).length;
  const h1 = p.html.match(/<h1[\s>]/g) ?? [];
  const hidden = [...p.html.matchAll(/style="[^"]*(opacity:\s*0(?![.\d])|translateY\(110%\))[^"]*"/g)];
  let good = true;
  if (p.status !== 200) (fail(`${p.path}: HTTP ${p.status}`), (good = false));
  if (h1.length !== 1) (fail(`${p.path}: ${h1.length} <h1> (skal være præcis 1)`), (good = false));
  if (words < 100) (fail(`${p.path}: kun ${words} ord`), (good = false));
  if (hidden.length) (fail(`${p.path}: ${hidden.length} elementer skjult med inline style`), (good = false));
  if (good) ok(`${p.path.padEnd(46)} ${String(words).padStart(4)} ord, 1 h1`);
}

/* 2. Head */
section("2. Titler, beskrivelser og canonical");
const titles = new Map();
for (const p of pages) {
  const title = decode(p.html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
  const desc = meta(p.html, "description");
  const canonical = head(p.html).match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
  const robots = meta(p.html, "robots");
  const ogImage = meta(p.html, "og:image");
  const problems = [];
  if (!title) problems.push("ingen title");
  else if (title.length > 60) problems.push(`title ${title.length} tegn`);
  if (titles.has(title)) problems.push(`title er dublet af ${titles.get(title)}`);
  titles.set(title, p.path);
  if (desc.length < 140 || desc.length > 155) problems.push(`description ${desc.length} tegn`);
  if (canonical !== p.url) problems.push(`canonical er "${canonical}"`);
  if (/noindex/.test(robots)) problems.push("noindex, men står i sitemap");
  if (!ogImage.startsWith(SITE.url)) problems.push(`og:image er ikke absolut: "${ogImage}"`);
  else if ((await get(local(ogImage))).status !== 200) problems.push(`og:image findes ikke: ${ogImage}`);
  if (problems.length) fail(`${p.path}: ${problems.join(", ")}`);
  else ok(`${p.path.padEnd(46)} title ${String(title.length).padStart(2)}, desc ${desc.length}`);
}

/* 3. JSON-LD */
section("3. Strukturerede data (JSON-LD)");
for (const p of pages) {
  const blocks = jsonLdBlocks(p.html);
  if (blocks.length !== 1) {
    fail(`${p.path}: ${blocks.length} JSON-LD-blokke (skal være 1)`);
    continue;
  }
  let graph;
  try {
    graph = JSON.parse(blocks[0])["@graph"];
  } catch (e) {
    fail(`${p.path}: ugyldig JSON-LD — ${e.message}`);
    continue;
  }
  const types = graph.map((n) => n["@type"]);
  const missing = ["OnlineStore", "Person", "WebSite"].filter((t) => !types.includes(t));
  if (missing.length) fail(`${p.path}: mangler ${missing.join(", ")}`);
  const pageNode = graph.find((n) => String(n["@id"] ?? "").endsWith("#webpage"));
  if (!pageNode || pageNode.url !== p.url) fail(`${p.path}: WebPage mangler eller har forkert url`);
  if (p.path.startsWith("/produkter/")) {
    const product = graph.find((n) => n["@type"] === "Product");
    if (!product?.offers?.price || product.offers.priceCurrency !== "DKK")
      fail(`${p.path}: Product uden pris i DKK`);
    if (!types.includes("BreadcrumbList")) fail(`${p.path}: mangler BreadcrumbList`);
  }
  // FAQ-markup skal stå ordret i den synlige tekst, ellers afviser Google den.
  const faq = graph.find((n) => n["@type"] === "FAQPage");
  if (faq) {
    const text = visibleText(p.html);
    for (const q of faq.mainEntity ?? []) {
      if (!text.includes(q.name)) fail(`${p.path}: FAQ-spørgsmål ikke synligt: "${q.name}"`);
      if (!text.includes(q.acceptedAnswer.text))
        fail(`${p.path}: FAQ-svar ikke synligt ordret: "${q.acceptedAnswer.text.slice(0, 50)}…"`);
    }
  }
  const emailInGraph = JSON.stringify(graph).includes(SITE.email);
  if (emailInGraph && p.path !== "/kontakt") fail(`${p.path}: e-mail i JSON-LD uden for /kontakt`);
  if (!missing.length) ok(`${p.path.padEnd(46)} ${types.join(", ")}`);
}

/* 4. Links og filer */
section("4. Interne links og filer");
const refs = new Map();
for (const p of pages) {
  const html = p.html;
  const found = [
    ...[...html.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/src="(\/[^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/srcSet="([^"]*)"/gi)].flatMap((m) =>
      m[1].split(",").map((c) => c.trim().split(" ")[0]),
    ),
  ];
  for (const ref of found) if (ref.startsWith("/") && !refs.has(ref)) refs.set(ref, p.path);
}
let broken = 0;
for (const [ref, from] of refs) {
  let res = await get(decode(ref));
  // Følg én redirect (fx kategori-links) og kræv 200 bagefter.
  if (res.status >= 300 && res.status < 400) res = await get(res.headers.get("location"));
  if (res.status !== 200) {
    fail(`${ref} → HTTP ${res.status} (fra ${from})`);
    broken++;
  }
}
if (!broken) ok(`${refs.size} interne links, billeder og filer — alle svarer 200`);

/* 5. Rodfiler, 404 og redirects */
section("5. robots.txt, sitemap, llms.txt, 404 og gamle adresser");
const robots = await (await get("/robots.txt")).text();
const bots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Bingbot", "Applebot"];
const missingBots = bots.filter((b) => !robots.includes(`User-agent: ${b}`));
missingBots.length ? fail(`robots.txt mangler ${missingBots.join(", ")}`) : ok(`robots.txt tillader ${bots.length} AI- og søgecrawlere`);
robots.includes(`Sitemap: ${SITE.url}/sitemap.xml`) ? ok("robots.txt peger på sitemap") : fail("robots.txt peger ikke på sitemap");
/Disallow:\s*\/\s*$/m.test(robots) && fail("robots.txt blokerer hele sitet");

const lastmods = (sitemap.match(/<lastmod>/g) ?? []).length;
lastmods === sitemapUrls.length ? ok(`sitemap: ${sitemapUrls.length} sider, alle med <lastmod>`) : fail(`sitemap: ${lastmods} af ${sitemapUrls.length} har <lastmod>`);
for (const noindexPath of ["/kurv", "/bestil", "/fortryd"]) {
  const html = await (await get(noindexPath)).text();
  if (!/noindex/.test(meta(html, "robots"))) fail(`${noindexPath} mangler noindex`);
  if (sitemapUrls.includes(SITE.url + noindexPath)) fail(`${noindexPath} står i sitemap`);
}
ok("/kurv, /bestil og /fortryd er noindex og står ikke i sitemap");

const llms = await get("/llms.txt");
const llmsText = await llms.text();
const notInLlms = sitemapUrls.filter((u) => u !== `${SITE.url}/` && !llmsText.includes(u));
llms.status === 200 && !notInLlms.length ? ok("llms.txt linker til alle sider") : fail(`llms.txt mangler: ${notInLlms.join(", ") || `HTTP ${llms.status}`}`);

const missing = await get("/denne-side-findes-ikke");
const missingHtml = await missing.text();
missing.status === 404 && /noindex/.test(meta(missingHtml, "robots"))
  ? ok("ukendt adresse giver 404 med noindex")
  : fail(`ukendt adresse gav HTTP ${missing.status}`);

let badRedirects = 0;
for (const [from, to] of Object.entries(REDIRECTS)) {
  const res = await get(from);
  const location = res.headers.get("location") ?? "";
  const target = await get(location);
  if (res.status !== 301 || !location.endsWith(to) || target.status !== 200) {
    fail(`${from} → ${res.status} ${location} (${target.status})`);
    badRedirects++;
  }
}
if (!badRedirects) ok(`${Object.keys(REDIRECTS).length} gamle adresser giver 301 til en side, der findes`);

/* 6. Ejerens regler */
section("6. Ejerens regler");
const all = pages.map((p) => ({ ...p, text: visibleText(p.html) }));
all.some((p) => /href="tel:/.test(p.html)) ? fail("tel:-link fundet") : ok("intet telefonnummer på sitet");
const mailPages = all.filter((p) => p.html.includes(SITE.email)).map((p) => p.path);
mailPages.length === 1 && mailPages[0] === "/kontakt"
  ? ok(`${SITE.email} står kun på /kontakt`)
  : fail(`e-mail fundet på: ${mailPages.join(", ") || "ingen sider"}`);
all.some((p) => p.html.includes("info@techboks.dk")) && fail("info@techboks.dk står i HTML");
const bundle = readdirSync(join(ROOT, ".output", "public", "assets"))
  .filter((f) => f.endsWith(".js"))
  .map((f) => readFileSync(join(ROOT, ".output", "public", "assets", f), "utf-8"))
  .join("\n");
bundle.includes("info@techboks.dk") ? fail("info@techboks.dk står i JavaScript") : ok("info@techboks.dk findes ingen steder");
const oldBrand = all.filter((p) => /3design/i.test(p.html.replaceAll(SITE.instagram, ""))).map((p) => p.path);
oldBrand.length ? fail(`det gamle brandnavn står på: ${oldBrand.join(", ")}`) : ok("det gamle brandnavn står ingen steder (kun i Instagram-adressen)");
for (const path of ["/om", "/kontakt"]) {
  const p = all.find((x) => x.path === path);
  p?.text.includes(SITE.owner.name) ? ok(`${SITE.owner.name} står på ${path}`) : fail(`${SITE.owner.name} mangler på ${path}`);
}
const noFooterLink = all.filter((p) => !/<footer[\s\S]*href="\/kontakt"[\s\S]*<\/footer>/.test(p.html)).map((p) => p.path);
noFooterLink.length ? fail(`footer uden link til kontakt: ${noFooterLink.join(", ")}`) : ok("footeren linker til /kontakt på alle sider");
all.some((p) => p.html.includes("fonts.googleapis.com")) ? fail("Google Fonts hentes stadig") : ok("ingen fonte fra Google (selvhostet)");

/* 7. Juridisk */
section("7. Juridiske oplysninger");
const noPrivacyLink = all.filter((p) => !/<footer[\s\S]*href="\/privatlivspolitik"[\s\S]*<\/footer>/.test(p.html)).map((p) => p.path);
noPrivacyLink.length ? fail(`footer uden link til privatlivspolitik: ${noPrivacyLink.join(", ")}`) : ok("footeren linker til /privatlivspolitik på alle sider");
// Forbrugeraftaleloven § 12: knappen, der gør ordren bindende, skal nævne betalingspligten.
const orderHtml = await (await get("/bestil")).text();
const submitButton = orderHtml.match(/<button[^>]*type="submit"[^>]*>([\s\S]*?)<\/button>/)?.[1] ?? "";
/betalingspligt|betalingsforpligtelse/i.test(visibleText(`<body>${submitButton}</body>`)) ? ok("bestillingsknappen nævner betalingspligt") : fail("bestillingsknappen på /bestil nævner ikke betalingspligt");
const orderMain = orderHtml.replace(/<footer[\s\S]*<\/footer>/, "");
/href="\/handelsbetingelser"/.test(orderMain) && /href="\/privatlivspolitik"/.test(orderMain) ? ok("/bestil linker til handelsbetingelser og privatlivspolitik ved knappen") : fail("/bestil mangler links til handelsbetingelser og privatlivspolitik ved knappen");
// Forbrugeraftaleloven § 20 a (fra 19. juni 2026): »Fortryd aftale« skal være let at finde,
// og knappen på /fortryd skal hedde »Bekræft fortrydelse«.
const noWithdrawalLink = all
  .filter((p) => !/<footer[\s\S]*<a\b[^>]*href="\/fortryd"[^>]*>Fortryd aftale<\/a>[\s\S]*<\/footer>/.test(p.html))
  .map((p) => p.path);
noWithdrawalLink.length ? fail(`footer uden »Fortryd aftale«-link: ${noWithdrawalLink.join(", ")}`) : ok("footeren har »Fortryd aftale« (/fortryd) på alle sider");
const withdrawalHtml = await (await get("/fortryd")).text();
const withdrawalButton = withdrawalHtml.match(/<button[^>]*type="submit"[^>]*>([\s\S]*?)<\/button>/)?.[1] ?? "";
/Bekræft fortrydelse/.test(visibleText(`<body>${withdrawalButton}</body>`)) ? ok("/fortryd har knappen »Bekræft fortrydelse«") : fail("/fortryd mangler knappen »Bekræft fortrydelse«");
// E-handelsloven § 7 og forbrugeraftaleloven § 8: fysisk adresse før køb.
SITE.address ? ok(`sælgeradresse: ${SITE.address}`) : warn("SITE.address er tom: e-handelsloven kræver en fysisk adresse på sitet (src/seo/site.ts)");

console.log(`\n${"─".repeat(64)}`);
console.log(`${pages.length} sider kontrolleret — ${failures} fejl, ${warnings} advarsler\n`);
server.kill();
process.exit(failures > 0 ? 1 : 0);
