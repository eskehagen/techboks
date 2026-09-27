// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { REDIRECTS } from "./src/seo/redirects";

const redirects = Object.fromEntries(
  Object.entries(REDIRECTS).map(([from, to]) => [from, { redirect: { to, status: 301 as const } }]),
);

const DAY = 60 * 60 * 24;

/**
 * Sendes videre til nitro. Lovables typer kender kun preset/output/cloudflare,
 * men alle nøgler videregives uændret til nitro() — se `userNitroOpts` i
 * @lovable.dev/vite-tanstack-config. Derfor typen herunder.
 */
type LovableNitroOptions = Exclude<Parameters<typeof defineConfig>[0], undefined> extends {
  nitro?: infer N;
}
  ? N
  : never;

const nitroOptions = {
  routeRules: {
    ...redirects,
    // Billeder og 3D-modeller har faste navne, så de caches i 30 dage.
    // /assets/ (med hash i navnet) caches i et år af nitro selv.
    "/images/**": { headers: { "cache-control": `public, max-age=${30 * DAY}` } },
    "/models/**": { headers: { "cache-control": `public, max-age=${30 * DAY}` } },
    "/og-image.jpg": { headers: { "cache-control": `public, max-age=${7 * DAY}` } },
  },
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    define: {
      // Sand, når Vercel bygger sitet. Styrer Vercel Web Analytics i __root.tsx.
      __ON_VERCEL__: JSON.stringify(process.env["VERCEL"] === "1"),
    },
  },
  nitro: nitroOptions as LovableNitroOptions,
});
