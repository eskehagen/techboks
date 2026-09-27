/**
 * Billedoptimering til web.
 *
 * Kør med:  npm run images
 * Kør det, hver gang du har lagt nye billeder i public/images/ eller tilføjet
 * et produkt. Scriptet er idempotent: det springer billeder over, der allerede
 * er optimeret, og det forringer aldrig et billede ved at køre igen.
 *
 * Hvad det gør:
 *  1. Billeder i public/images/ over 1600 px skaleres ned til 1600 px (intet
 *     vises større end ca. 800 CSS-px, og 1600 px dækker skærme med 2x
 *     pixeltæthed). Originalerne ligger i git-historikken.
 *  2. Ved siden af hvert billede skrives <navn>.webp og mindre udgaver:
 *     <navn>-800.webp til kort og gitre og <navn>-320.webp til miniaturer.
 *     <Picture> og galleriet vælger selv via srcset.
 *  3. De faktiske mål skrives til src/data/imageSizes.ts, så hvert <img> får
 *     rigtige width/height, og siden ikke hopper, mens billederne hentes.
 *  4. Logo, favicons og hero-billede i små, rigtige størrelser.
 *  5. Delingsbilleder (Open Graph) i 1200×630: ét for hele sitet og ét pr.
 *     produkt i public/images/og/.
 */

import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const IMAGES = join(PUBLIC, "images");
const OG_DIR = join(IMAGES, "og");
const ASSETS = join(ROOT, "src", "assets");

const LIMIT = 1600;
const SMALL = 800;
const THUMB = 320;
/** Sitets baggrundsfarve (--canvas) — bruges bag produkter på delingsbilleder. */
const CANVAS = "#f0efe9";

const kb = (file) => `${(statSync(file).size / 1024).toFixed(0).padStart(6)} KB`;
const isNewer = (a, b) => existsSync(b) && statSync(b).mtimeMs >= statSync(a).mtimeMs;

/** Billedets mål, som browseren viser det (EXIF-rotation taget med). */
async function displaySize(file) {
  const m = await sharp(file).metadata();
  const swap = (m.orientation ?? 1) >= 5;
  return swap ? { w: m.height, h: m.width } : { w: m.width, h: m.height };
}

async function shrinkOriginal(file) {
  const { w, h } = await displaySize(file);
  if (Math.max(w, h) <= LIMIT) return false;
  const before = kb(file);
  const img = sharp(file).rotate().resize({ width: LIMIT, height: LIMIT, fit: "inside" });
  const buf = file.toLowerCase().endsWith(".png")
    ? await img.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer()
    : await img.jpeg({ quality: 80, mozjpeg: true, progressive: true }).toBuffer();
  // En PNG med skarpe kanter kan blive større af at blive skaleret — så
  // beholdes originalen. WebP-varianterne laves under alle omstændigheder.
  if (buf.length >= statSync(file).size) return false;
  writeFileSync(file, buf);
  console.log(`  nedskaleret  ${parse(file).base.padEnd(34)} ${before} → ${kb(file)}`);
  return true;
}

async function writeWebp(file, force) {
  const { dir, name } = parse(file);
  const full = join(dir, `${name}.webp`);
  const small = join(dir, `${name}-${SMALL}.webp`);
  const thumb = join(dir, `${name}-${THUMB}.webp`);
  const { w } = await displaySize(file);

  if (force || !isNewer(file, full)) {
    await sharp(file).rotate().webp({ quality: 78 }).toFile(full);
  }
  if (w > SMALL && (force || !isNewer(file, small))) {
    await sharp(file).rotate().resize({ width: SMALL }).webp({ quality: 76 }).toFile(small);
  }
  if (w > THUMB && (force || !isNewer(file, thumb))) {
    await sharp(file).rotate().resize({ width: THUMB }).webp({ quality: 74 }).toFile(thumb);
  }
}

async function productImages() {
  console.log("\n1. Produktbilleder\n");
  const sizes = [];
  const files = readdirSync(IMAGES)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort();
  for (const f of files) {
    const file = join(IMAGES, f);
    const shrunk = await shrinkOriginal(file);
    await writeWebp(file, shrunk);
    const { w, h } = await displaySize(file);
    sizes.push([`/images/${f}`, w, h]);
  }
  console.log(`  ${files.length} billeder har WebP-varianter`);
  return sizes;
}

function writeSizeMap(sizes) {
  const og = existsSync(OG_DIR)
    ? readdirSync(OG_DIR)
        .filter((f) => f.endsWith(".jpg"))
        .map((f) => f.replace(/\.jpg$/, ""))
        .sort()
    : [];
  const lines = [
    "/**",
    " * Faktiske billedmål — GENERERET af scripts/optimize-images.mjs.",
    " * Rediger ikke i hånden; kør `npm run images`.",
    " *",
    " * Bruges af <Picture> til width/height og srcset. Et billede, der mangler",
    " * her, vises stadig — bare uden WebP og uden faste mål.",
    " */",
    "",
    "export const IMAGE_SIZES: Record<string, { w: number; h: number }> = {",
    ...sizes.map(([key, w, h]) => `  "${key}": { w: ${w}, h: ${h} },`),
    "};",
    "",
    "/** Produkter med eget delingsbillede i public/images/og/<slug>.jpg (1200×630). */",
    "export const OG_IMAGES = new Set<string>([",
    ...og.map((slug) => `  "${slug}",`),
    "]);",
    "",
  ];
  writeFileSync(join(ROOT, "src", "data", "imageSizes.ts"), lines.join("\n"));
  console.log(`\n  src/data/imageSizes.ts: ${sizes.length} billeder, ${og.length} delingsbilleder`);
}

async function logoAndIcons() {
  console.log("\n2. Logo og favicons\n");
  const logo = join(ASSETS, "logo-mark-c.png");

  // Logoet vises i 36×36 CSS-px; 108 px dækker 3x-skærme.
  const smallLogo = join(ASSETS, "logo-mark-108.png");
  await sharp(logo).resize(108, 108).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(smallLogo);
  console.log(`  logo-mark-108.png      ${kb(smallLogo)}  (original: ${kb(logo)})`);

  for (const [size, name] of [
    [32, "favicon-32.png"],
    [192, "favicon-192.png"],
  ]) {
    const out = join(PUBLIC, name);
    await sharp(logo).resize(size, size).png({ compressionLevel: 9 }).toFile(out);
    console.log(`  ${name.padEnd(22)} ${kb(out)}`);
  }

  // iOS lægger sort bag gennemsigtige ikoner — giv den en lys baggrund og luft.
  const touch = join(PUBLIC, "apple-touch-icon.png");
  const inner = await sharp(logo).resize(150, 150).toBuffer();
  await sharp({ create: { width: 180, height: 180, channels: 4, background: "#ffffff" } })
    .composite([{ input: inner, left: 15, top: 15 }])
    .png({ compressionLevel: 9 })
    .toFile(touch);
  console.log(`  apple-touch-icon.png   ${kb(touch)}`);

  // favicon.ico: browsere spørger efter den uanset hvad <head> siger. En ICO
  // må indeholde en PNG direkte (6 bytes header + 16 bytes katalog + PNG).
  const png32 = await sharp(logo).resize(32, 32).png().toBuffer();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserveret
  header.writeUInt16LE(1, 2); // type: ikon
  header.writeUInt16LE(1, 4); // antal billeder
  header.writeUInt8(32, 6); // bredde
  header.writeUInt8(32, 7); // højde
  header.writeUInt8(0, 8); // farvepalet
  header.writeUInt8(0, 9); // reserveret
  header.writeUInt16LE(1, 10); // farveplaner
  header.writeUInt16LE(32, 12); // bits pr. pixel
  header.writeUInt32LE(png32.length, 14);
  header.writeUInt32LE(22, 18); // offset til billeddata
  writeFileSync(join(PUBLIC, "favicon.ico"), Buffer.concat([header, png32]));
  console.log(`  favicon.ico            ${kb(join(PUBLIC, "favicon.ico"))}`);
}

async function hero() {
  console.log("\n3. Hero-billede\n");
  const src = join(ASSETS, "hero-workshop.jpg");
  for (const [width, name] of [
    [LIMIT, "hero-workshop.webp"],
    [SMALL, "hero-workshop-800.webp"],
  ]) {
    const out = join(ASSETS, name);
    if (isNewer(src, out)) continue;
    await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 76 }).toFile(out);
    console.log(`  ${name.padEnd(22)} ${kb(out)}`);
  }
}

/** Et produktbillede centreret på sitets baggrundsfarve, uden at noget skæres væk. */
async function containOnCanvas(file, width, height) {
  const inner = await sharp(file)
    .rotate()
    .resize({ width: width - 80, height: height - 60, fit: "inside" })
    .toBuffer();
  const meta = await sharp(inner).metadata();
  return sharp({ create: { width, height, channels: 3, background: CANVAS } })
    .composite([
      {
        input: inner,
        left: Math.round((width - meta.width) / 2),
        top: Math.round((height - meta.height) / 2),
      },
    ])
    .jpeg({ quality: 82, mozjpeg: true, progressive: true });
}

async function openGraph() {
  console.log("\n4. Delingsbilleder (1200×630)\n");

  // Sitets standardbillede: tre af de nuværende produkter side om side.
  // (Kollagen på forsiden viser et produkt, der ikke sælges længere, og flere
  // produktfotos har vandmærke med det gamle brandnavn — disse tre har ikke.)
  const siteOg = join(PUBLIC, "og-image.jpg");
  const tiles = ["frontBox1.jpg", "trashBin1.jpg", "case6pack.jpg"];
  const tileW = 396;
  const gap = 6;
  const buffers = await Promise.all(
    tiles.map((f) =>
      sharp(join(IMAGES, f)).rotate().resize(tileW, 630, { fit: "cover" }).toBuffer(),
    ),
  );
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: CANVAS } })
    .composite(buffers.map((input, i) => ({ input, left: i * (tileW + gap), top: 0 })))
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toFile(siteOg);
  console.log(`  og-image.jpg           ${kb(siteOg)}`);

  // Ét pr. produkt, ud fra produktets første billede. Skifter du et produkts
  // første billede, så slet public/images/og/<slug>.jpg og kør scriptet igen.
  let products;
  try {
    ({ products } = await import("../src/data/products.ts"));
  } catch (error) {
    console.log(
      `  ! kunne ikke læse src/data/products.ts (${error.message}).\n` +
        "    Kræver Node 22.18 eller nyere. Produkternes delingsbilleder er ikke opdateret.",
    );
    return;
  }
  mkdirSync(OG_DIR, { recursive: true });
  for (const p of products) {
    const src = join(PUBLIC, p.images[0]);
    const out = join(OG_DIR, `${p.slug}.jpg`);
    if (isNewer(src, out)) continue;
    await (await containOnCanvas(src, 1200, 630)).toFile(out);
    console.log(`  og/${p.slug}.jpg`.padEnd(48) + kb(out));
  }
}

const sizes = await productImages();
await logoAndIcons();
await hero();
await openGraph();
writeSizeMap(sizes);
console.log("\nFærdig.\n");
