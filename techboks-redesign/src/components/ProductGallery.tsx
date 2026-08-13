import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Product image gallery.
 *
 * The page-level view carries its own arrows, swipe and thumbnails; clicking
 * the main image lifts the same set into a full-screen lightbox that shares
 * the index, so the customer never loses their place between the two.
 */

/** Past this drag distance (px) or flick speed (px/s) a swipe counts as a page turn. */
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 340;
/** Vertical drag needed to throw the lightbox away. */
const DISMISS_DISTANCE = 130;

const slide = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? "16%" : "-16%",
    scale: 1.03,
  }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? "-12%" : "12%",
    scale: 0.98,
  }),
};

const fade = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const slideTransition = {
  x: { type: "spring", stiffness: 260, damping: 30 },
  opacity: { duration: 0.26 },
  scale: { duration: 0.34, ease: "easeOut" },
} as const;

/** Which way to move, given how a drag ended. 0 = stay put. */
function swipeStep(info: PanInfo): number {
  if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) return 1;
  if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) return -1;
  return 0;
}

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  // Index and direction travel together so the exit animation knows which way
  // the previous image should leave.
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragged = useRef(false);
  const reduced = useReducedMotion() ?? false;

  const count = images.length;
  const many = count > 1;

  useEffect(() => setMounted(true), []);

  const goTo = useCallback(
    (next: number) => setSlide(([current]) => [next, next > current ? 1 : next < current ? -1 : 0]),
    [],
  );

  const paginate = useCallback(
    (step: number) => setSlide(([current]) => [(current + step + count) % count, step]),
    [count],
  );

  // Keep the neighbours warm so an arrow press swaps instantly.
  useEffect(() => {
    if (!many || typeof window === "undefined") return;
    for (const step of [1, -1]) {
      const preload = new window.Image();
      preload.src = images[(index + step + count) % count]!;
    }
  }, [images, index, count, many]);

  if (count === 0) return null;

  const variants = reduced ? fade : slide;
  const src = images[index]!;
  const label = many ? `${alt} — billede ${index + 1} af ${count}` : alt;

  return (
    <>
      <div className="group/gallery relative">
        <div className="rounded-blob-lg bg-muted relative aspect-[4/3] overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={index}
              src={src}
              alt={label}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              drag={many ? "x" : false}
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onPointerDown={() => (dragged.current = false)}
              onDragStart={() => (dragged.current = true)}
              onDragEnd={(_, info) => {
                const step = swipeStep(info);
                if (step) paginate(step);
              }}
              onClick={() => {
                if (!dragged.current) setOpen(true);
              }}
              draggable={false}
              className="absolute inset-0 h-full w-full cursor-zoom-in object-cover select-none"
            />
          </AnimatePresence>

          {/* Zoom affordance — sits above the image, out of the drag's way. */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <span className="bg-ink/55 text-canvas absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/gallery:opacity-100">
              <Expand className="h-4 w-4" />
            </span>
            {many && (
              <span className="bg-ink/55 text-canvas absolute right-4 bottom-4 rounded-full px-3 py-1.5 text-xs font-semibold tabular-nums backdrop-blur-md">
                {index + 1} / {count}
              </span>
            )}
          </div>
        </div>

        {many && (
          <>
            <ArrowButton side="left" label="Forrige billede" onClick={() => paginate(-1)} />
            <ArrowButton side="right" label="Næste billede" onClick={() => paginate(1)} />
          </>
        )}
      </div>

      {many && (
        <Thumbnails
          images={images}
          index={index}
          onSelect={goTo}
          layoutId="gallery-thumb"
          className="mt-3 flex gap-3 overflow-x-auto pb-1"
          itemClassName="h-20 w-20"
        />
      )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <Lightbox
                images={images}
                alt={alt}
                index={index}
                direction={direction}
                reduced={reduced}
                onClose={() => setOpen(false)}
                onSelect={goTo}
                onPaginate={paginate}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

function ArrowButton({
  side,
  label,
  onClick,
  tone = "light",
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
  tone?: "light" | "dark";
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:outline-none active:scale-95 ${
        side === "left" ? "left-3" : "right-3"
      } ${
        tone === "light"
          ? "bg-surface/85 text-ink hover:bg-surface focus-visible:ring-ink/40 shadow-lg"
          : "bg-canvas/10 text-canvas hover:bg-canvas/25 focus-visible:ring-canvas/60"
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

function Thumbnails({
  images,
  index,
  onSelect,
  layoutId,
  className,
  itemClassName,
  tone = "light",
}: {
  images: string[];
  index: number;
  onSelect: (i: number) => void;
  layoutId: string;
  className: string;
  itemClassName: string;
  tone?: "light" | "dark";
}) {
  const activeRef = useRef<HTMLButtonElement>(null);
  // Skipped on mount: the rail is often below the fold on load, and scrolling
  // it into view would drag the whole page down with it.
  const settled = useRef(false);

  useEffect(() => {
    if (!settled.current) {
      settled.current = true;
      return;
    }
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [index]);

  return (
    <div className={className}>
      {images.map((src, i) => {
        const active = i === index;
        return (
          <button
            key={src}
            ref={active ? activeRef : undefined}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Vis billede ${i + 1}`}
            aria-current={active}
            className={`relative shrink-0 overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-105 ${itemClassName} ${
              active ? "" : "opacity-60 hover:opacity-100"
            }`}
          >
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            {active && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className={`pointer-events-none absolute inset-0 rounded-2xl ring-2 ${
                  tone === "light" ? "ring-ink" : "ring-canvas"
                }`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function Lightbox({
  images,
  alt,
  index,
  direction,
  reduced,
  onClose,
  onSelect,
  onPaginate,
}: {
  images: string[];
  alt: string;
  index: number;
  direction: number;
  reduced: boolean;
  onClose: () => void;
  onSelect: (i: number) => void;
  onPaginate: (step: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const count = images.length;
  const many = count > 1;

  // Own the screen: lock the page, take focus, and hand it back on close.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onPaginate(1);
      else if (e.key === "ArrowLeft") onPaginate(-1);
      else if (e.key === "Home") onSelect(0);
      else if (e.key === "End") onSelect(count - 1);
      else if (e.key === "Tab") {
        // Keep tabbing inside the dialog while it covers the page.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusables?.length) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      } else return;
      if (e.key !== "Tab") e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onPaginate, onSelect, count]);

  const variants = reduced ? fade : slide;

  return (
    <motion.div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — billeder`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.24 } }}
      transition={{ duration: 0.24 }}
      className="fixed inset-0 z-100 flex flex-col outline-none"
    >
      <button
        type="button"
        aria-label="Luk galleri"
        tabIndex={-1}
        onClick={onClose}
        className="bg-ink/90 absolute inset-0 -z-10 cursor-zoom-out backdrop-blur-xl"
      />

      <div className="relative flex items-center justify-between px-4 pt-4 sm:px-6 sm:pt-6">
        <span className="text-canvas/60 text-xs font-semibold tracking-[0.2em] tabular-nums uppercase">
          {many ? `${index + 1} / ${count}` : alt}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Luk galleri"
          className="bg-canvas/10 text-canvas hover:bg-canvas/25 focus-visible:ring-canvas/60 grid h-11 w-11 place-items-center rounded-full backdrop-blur-md transition-all duration-300 hover:rotate-90 focus-visible:ring-2 focus-visible:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={index}
            src={images[index]}
            alt={many ? `${alt} — billede ${index + 1} af ${count}` : alt}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            drag
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            dragSnapToOrigin
            onDragEnd={(_, info) => {
              const { x, y } = info.offset;
              // A deliberate vertical throw dismisses; anything flatter pages.
              if (Math.abs(y) > DISMISS_DISTANCE && Math.abs(y) > Math.abs(x)) {
                onClose();
                return;
              }
              const step = many ? swipeStep(info) : 0;
              if (step) onPaginate(step);
            }}
            draggable={false}
            className="absolute inset-0 m-auto max-h-full max-w-[92vw] cursor-grab object-contain p-4 select-none active:cursor-grabbing sm:p-8"
          />
        </AnimatePresence>

        {many && (
          <>
            <ArrowButton
              side="left"
              tone="dark"
              label="Forrige billede"
              onClick={() => onPaginate(-1)}
            />
            <ArrowButton
              side="right"
              tone="dark"
              label="Næste billede"
              onClick={() => onPaginate(1)}
            />
          </>
        )}
      </div>

      {many && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 300, damping: 30 }}
          className="relative flex justify-center px-4 pb-6"
        >
          <Thumbnails
            images={images}
            index={index}
            onSelect={onSelect}
            layoutId="lightbox-thumb"
            tone="dark"
            className="flex max-w-full gap-2 overflow-x-auto rounded-full p-1"
            itemClassName="h-16 w-16"
          />
        </motion.div>
      )}
    </motion.div>
  );
}
