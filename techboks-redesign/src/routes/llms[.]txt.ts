import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      // Dynamisk import: så kommer FAQ-tekster og beskrivelser ikke med i det
      // JavaScript, som alle sider henter i browseren. Se src/seo/llms.ts.
      GET: async () => {
        const { buildLlmsTxt } = await import("@/seo/llms");
        return new Response(buildLlmsTxt(), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
