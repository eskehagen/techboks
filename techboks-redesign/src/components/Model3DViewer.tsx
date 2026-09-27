import { Rotate3d } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SceneHandle } from "./model3d-scene";

interface Model3DViewerProps {
  src: string;
  className?: string | undefined;
  rotation?: [number, number, number] | undefined;
}

/**
 * Rotatable STL preview, presented as a lit studio shot: light satin model on a
 * dark stage, environment-mapped reflections, a soft contact shadow, and a mint
 * rim light picking out the silhouette.
 *
 * Nothing heavy loads with the page. With a mouse, three.js and the STL file
 * are fetched once the viewer comes within a screen's height of the viewport.
 * On touch devices the visitor taps "Vis 3D-model" first — a continuously
 * rendered WebGL scene (and STL files of up to 15 MB) cost a phone battery,
 * data and responsiveness. Either way the render loop pauses off screen.
 */
export function Model3DViewer({ src, className, rotation }: Model3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneHandle | null>(null);
  const [near, setNear] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [hasInteracted, setHasInteracted] = useState(false);

  // Compare by value: callers pass a fresh array literal on every render,
  // which used to rebuild the whole scene each time an option was clicked.
  const [rx = 0, ry = 0, rz = 0] = rotation ?? [];

  useEffect(() => {
    setAutoStart(window.matchMedia("(pointer: fine)").matches);
  }, []);

  // With a mouse: start loading when the viewer is about one screen away.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || near || !autoStart) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setNear(true);
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [near, autoStart]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!near || !host) return;
    let cancelled = false;
    setStatus("loading");
    import("./model3d-scene")
      .then(({ mountScene }) => {
        if (cancelled) return;
        sceneRef.current = mountScene(host, {
          src,
          rotation: [rx, ry, rz],
          onStatus: (next) => {
            if (!cancelled) setStatus(next);
          },
          onInteract: () => setHasInteracted(true),
        });
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [near, src, rx, ry, rz]);

  // Pause the render loop while the viewer is off screen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !near) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      sceneRef.current?.setPaused(!visible);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [near, status]);

  return (
    <div
      ref={containerRef}
      className={`rounded-blob-lg bg-ink relative overflow-hidden ${className ?? ""}`}
    >
      {/* Stage lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_5%,rgba(94,224,176,0.16),transparent_55%),radial-gradient(90%_70%_at_20%_100%,rgba(255,255,255,0.07),transparent_60%)]"
      />
      <div
        aria-hidden
        className="ring-canvas/10 pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset"
      />

      <div ref={canvasHostRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

      {/* Badge */}
      <span className="bg-canvas/10 text-canvas/70 ring-canvas/10 pointer-events-none absolute top-4 left-4 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase ring-1 backdrop-blur-sm">
        3D model
      </span>

      {/* Interaction hint — fades once the user grabs the model */}
      {status === "ready" && (
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-4 flex justify-center transition-opacity duration-700 ${
            hasInteracted ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="bg-ink/60 text-canvas/70 ring-canvas/10 rounded-full px-4 py-2 text-xs ring-1 backdrop-blur-sm">
            Træk for at rotere · scroll for at zoome
          </span>
        </div>
      )}

      {status === "idle" && (
        <div className="absolute inset-0 grid place-items-center">
          <button
            type="button"
            onClick={() => setNear(true)}
            className="bg-canvas/10 text-canvas ring-canvas/15 hover:bg-canvas/20 inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold ring-1 backdrop-blur-sm transition-colors"
          >
            <Rotate3d className="h-4 w-4" aria-hidden="true" />
            Vis 3D-model
          </button>
        </div>
      )}

      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-3">
            <span className="border-canvas/15 border-t-accent-mint h-8 w-8 animate-spin rounded-full border-2" />
            <span className="text-canvas/50 text-xs tracking-wide">Indlæser 3D model…</span>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center px-6">
          <span className="text-canvas/50 text-center text-sm">
            Kunne ikke indlæse 3D modellen.
          </span>
        </div>
      )}
    </div>
  );
}
