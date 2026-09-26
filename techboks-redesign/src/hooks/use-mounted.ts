import { useEffect, useState } from "react";

/**
 * False on the server and during hydration, true right after.
 *
 * Scroll-driven effects start at opacity 0 / off to the side. Applying them
 * only once mounted keeps that state out of the server HTML, so crawlers and
 * visitors without JavaScript see the content where it belongs.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
