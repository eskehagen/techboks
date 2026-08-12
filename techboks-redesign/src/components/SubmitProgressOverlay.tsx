import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { Check, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Full-screen "the system is working" overlay shared by the order and contact
 * forms.
 *
 * `sending` runs an open-ended progress animation (the endpoints report no
 * real progress, so the bar eases toward 94% and waits there), and `success`
 * completes it before handing over to the page's own confirmation.
 *
 * Each form supplies its own illustration through `scene`, so the mechanics —
 * progress, steps, scroll lock, completion beat — stay in one place.
 */
export type SubmitOverlayPhase = "sending" | "success";

export interface SubmitOverlayStep {
  icon: LucideIcon;
  label: string;
}

/** Fade-out duration of the overlay, in ms. */
const EXIT_MS = 350;

export function SubmitProgressOverlay({
  phase,
  onFinished,
  label,
  eyebrow,
  steps,
  headline,
  description,
  slowHint,
  scene,
}: {
  phase: SubmitOverlayPhase | null;
  /** Called once the completion beat has played out. */
  onFinished: () => void;
  /** Accessible name of the dialog. */
  label: string;
  eyebrow: string;
  steps: SubmitOverlayStep[];
  headline: { sending: string; done: string };
  description: { sending: string; done: string };
  /** Shown when the request drags on, so a slow endpoint doesn't read as a failure. */
  slowHint: string;
  scene: (state: { done: boolean; reduced: boolean }) => ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;
  const progress = useMotionValue(0);
  const percent = useTransform(progress, (v) => `${Math.round(v)}%`);
  const barScale = useTransform(progress, (v) => v / 100);
  const [stepIndex, setStepIndex] = useState(0);
  const [slow, setSlow] = useState(false);
  const [lingering, setLingering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  // Kept in a ref so an unstable callback can't restart the handover timer.
  const finishedRef = useRef(onFinished);
  finishedRef.current = onFinished;

  const open = phase !== null;
  const done = phase === "success";

  useMotionValueEvent(progress, "change", (v) => {
    setStepIndex(v < 32 ? 0 : v < 70 ? 1 : 2);
  });

  useEffect(() => {
    if (phase === "sending") {
      progress.set(0);
      setSlow(false);
      const controls = animate(progress, 94, {
        duration: reduced ? 6 : 14,
        ease: [0.05, 0.7, 0.1, 1],
      });
      const slowTimer = window.setTimeout(() => setSlow(true), 9000);
      return () => {
        controls.stop();
        window.clearTimeout(slowTimer);
      };
    }

    if (phase === "success") {
      const controls = animate(progress, 100, {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      });
      const handover = window.setTimeout(() => finishedRef.current(), reduced ? 700 : 1500);
      return () => {
        controls.stop();
        window.clearTimeout(handover);
      };
    }

    return undefined;
  }, [phase, progress, reduced]);

  // Keep the page behind still while the overlay owns the screen.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cardRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /*
   * Safety net: exit animations are frame-driven, so a backgrounded tab can
   * leave the fade-out unfinished — and a full-screen overlay stuck on top of
   * the confirmation. Once the exit window has passed we drop the whole
   * AnimatePresence, finished or not.
   */
  useEffect(() => {
    if (open) {
      setLingering(true);
      return undefined;
    }
    const timer = window.setTimeout(() => setLingering(false), EXIT_MS + 150);
    return () => window.clearTimeout(timer);
  }, [open]);

  if (!open && !lingering) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="submit-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: EXIT_MS / 1000, ease: "easeInOut" },
          }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
        >
          <div className="bg-ink/80 absolute inset-0 backdrop-blur-xl" />

          {/* Ambient light behind the card. */}
          {!reduced && (
            <>
              <motion.div
                aria-hidden
                animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.55, 0.35] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="bg-accent-mint/30 pointer-events-none absolute h-[28rem] w-[28rem] rounded-full blur-[110px]"
              />
              <motion.div
                aria-hidden
                animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.2, 0.35, 0.2] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="bg-signal/40 pointer-events-none absolute h-[22rem] w-[22rem] -translate-x-32 translate-y-24 rounded-full blur-[110px]"
              />
            </>
          )}

          <motion.div
            ref={cardRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-busy={!done}
            aria-label={label}
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: -12,
              scale: 0.97,
              transition: { duration: 0.3 },
            }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="rounded-blob-lg bg-ink text-canvas ring-canvas/10 relative w-full max-w-md overflow-hidden p-7 shadow-2xl ring-1 outline-none sm:p-9"
          >
            <div className="flex items-center justify-between">
              <span className="text-canvas/45 text-[11px] tracking-[0.24em] uppercase">
                {eyebrow}
              </span>
              <motion.span className="font-display text-canvas/80 text-sm font-semibold tabular-nums">
                {percent}
              </motion.span>
            </div>

            <div className="relative mx-auto mt-6 w-full max-w-[17rem]">
              <svg viewBox="0 0 220 170" className="h-auto w-full" aria-hidden>
                {scene({ done, reduced })}
              </svg>
            </div>

            <div className="mt-6 min-h-[4.75rem] text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={done ? "done" : "sending"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {done ? headline.done : headline.sending}
                    {!done && <AnimatedDots />}
                  </h2>
                  <p className="text-canvas/55 mx-auto mt-2 max-w-xs text-sm leading-relaxed">
                    {done ? description.done : description.sending}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress rail. */}
            <div className="bg-canvas/10 relative mt-5 h-1.5 overflow-hidden rounded-full">
              <motion.div
                style={{ scaleX: barScale }}
                className="bg-accent-mint absolute inset-0 origin-left rounded-full"
              />
              {!reduced && !done && (
                <motion.div
                  aria-hidden
                  animate={{ x: ["-60%", "160%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="via-canvas/70 absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent to-transparent"
                />
              )}
            </div>

            {/* Steps. */}
            <ul className="mt-6 space-y-2.5" aria-live="polite">
              {steps.map((step, i) => {
                const state = done || i < stepIndex ? "done" : i === stepIndex ? "active" : "idle";
                return (
                  <li key={step.label} className="flex items-center gap-3">
                    <motion.span
                      animate={{
                        backgroundColor:
                          state === "done"
                            ? "var(--color-accent-mint)"
                            : state === "active"
                              ? "color-mix(in oklab, var(--color-accent-mint) 20%, transparent)"
                              : "color-mix(in oklab, var(--color-canvas) 8%, transparent)",
                        scale: state === "active" ? 1 : 0.92,
                      }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full"
                    >
                      {state === "active" && !reduced && (
                        <motion.span
                          aria-hidden
                          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                          className="border-accent-mint absolute inset-0 rounded-full border"
                        />
                      )}
                      <AnimatePresence mode="wait" initial={false}>
                        {state === "done" ? (
                          <motion.span
                            key="check"
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 420, damping: 18 }}
                            className="text-accent-mint-foreground"
                          >
                            <Check className="h-4 w-4" strokeWidth={3} />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="icon"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            className={state === "active" ? "text-accent-mint" : "text-canvas/35"}
                          >
                            <step.icon className="h-4 w-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.span>
                    <motion.span
                      animate={{ opacity: state === "idle" ? 0.4 : 1 }}
                      className={`text-sm ${state === "active" ? "font-semibold" : "font-medium"}`}
                    >
                      {step.label}
                    </motion.span>
                  </li>
                );
              })}
            </ul>

            <AnimatePresence>
              {slow && !done && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-canvas/45 mt-5 text-center text-xs leading-relaxed"
                >
                  {slowHint}
                </motion.p>
              )}
            </AnimatePresence>

            {done && !reduced && <Confetti />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Mint check badge that lands in the middle of a scene once the request is through. */
export function CompletionBadge({ cx, cy, r = 24 }: { cx: number; cy: number; r?: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.25 }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <motion.circle
        cx={cx}
        cy={cy}
        r={r + 4}
        className="text-accent-mint"
        fill="currentColor"
        animate={{ opacity: [0, 0.35, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        style={{ filter: "blur(6px)" }}
      />
      <circle cx={cx} cy={cy} r={r} className="text-accent-mint" fill="currentColor" />
      <motion.path
        d={`M ${cx - 11} ${cy} L ${cx - 3} ${cy + 8} L ${cx + 12} ${cy - 8}`}
        className="text-accent-mint-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, delay: 0.42, ease: "easeOut" }}
      />
    </motion.g>
  );
}

/** Animated ellipsis that keeps ticking while we wait. */
function AnimatedDots() {
  return (
    <span aria-hidden className="inline-flex w-[1.1em] justify-start">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}

/** Small mint burst when the request lands. */
function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const distance = 90 + (i % 4) * 34;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
            animate={{
              opacity: [0, 1, 0],
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance * 0.75,
              scale: [0.4, 1, 0.6],
              rotate: i * 40,
            }}
            transition={{
              duration: 1.1,
              delay: 0.3 + (i % 5) * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`absolute top-1/2 left-1/2 h-1.5 w-1.5 ${
              i % 3 === 0 ? "bg-canvas/70" : "bg-accent-mint"
            } ${i % 2 === 0 ? "rounded-full" : "rounded-[1px]"}`}
          />
        );
      })}
    </div>
  );
}
