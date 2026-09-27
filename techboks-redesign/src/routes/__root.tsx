import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import interLatin from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import spaceGroteskLatin from "@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/seo/site";

function NotFoundComponent() {
  return (
    <div className="container-tb py-24 text-center sm:py-32">
      <span className="eyebrow">Fejl 404</span>
      <h1 className="display-lg text-ink mt-4">Siden findes ikke</h1>
      <p className="text-muted-foreground mx-auto mt-5 max-w-md text-base leading-relaxed">
        Adressen er måske skrevet forkert, eller siden er flyttet. Prøv en af disse i stedet:
      </p>
      <nav aria-label="Forslag" className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="bg-ink text-canvas inline-flex h-12 items-center rounded-full px-6 text-sm font-semibold"
        >
          Forside
        </Link>
        <Link
          to="/produkter"
          search={{ kategori: "alle", q: "" }}
          className="border-ink/20 text-ink inline-flex h-12 items-center rounded-full border px-6 text-sm font-semibold"
        >
          Alle produkter
        </Link>
        <Link
          to="/kontakt"
          className="border-ink/20 text-ink inline-flex h-12 items-center rounded-full border px-6 text-sm font-semibold"
        >
          Kontakt
        </Link>
      </nav>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Siden kunne ikke indlæses
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Noget gik galt hos os. Prøv at genindlæse siden, eller gå til forsiden.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Prøv igen
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Til forsiden
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        // minimum-scale=1 blokerer udzoom under 100% — indzoom er stadig tilladt.
        content: "width=device-width, initial-scale=1, minimum-scale=1",
      },
      { name: "theme-color", content: "#f0efe9" },
      { property: "og:site_name", content: SITE.name },
      { property: "og:locale", content: "da_DK" },
      // Fallback for adresser uden egen side (404). Alle rigtige sider sætter
      // deres egen title og robots via pageHead() og overskriver disse.
      { title: "Siden findes ikke | TechBoks" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // De to fonte, der bruges over folden. Resten hentes efter behov.
      { rel: "preload", as: "font", type: "font/woff2", href: interLatin, crossOrigin: "anonymous" },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: spaceGroteskLatin,
        crossOrigin: "anonymous",
      },
      // /favicon.ico ligger også i roden til browsere, der selv spørger efter den.
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon-192.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    // Vercel Web Analytics: ingen cookies, ingen persondata. Kun på Vercel —
    // lokalt findes scriptet ikke.
    scripts: __ON_VERCEL__ ? [{ src: "/_vercel/insights/script.js", defer: true }] : [],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="da">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {/* overflow-x-clip: kort, der flyver ind fra siden, må ikke give vandret
            scroll på mobil. clip (ikke hidden) bevarer den sticky header. */}
        <div className="bg-canvas flex min-h-screen flex-col overflow-x-clip">
          <a
            href="#indhold"
            className="bg-ink text-canvas sr-only z-[60] rounded-full px-5 py-3 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
          >
            Spring til indhold
          </a>
          <Header />
          <main id="indhold" className="flex-1">
            {/* Required: nested routes render here. */}
            <Outlet />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </QueryClientProvider>
  );
}

