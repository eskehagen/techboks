import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { Check, Package, Send, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Full-screen "the system is working" overlay for the order submission.
 *
 * `sending` runs an open-ended progress animation (the endpoint has no
 * progress to report, so the bar eases toward 94% and waits there), and
 * `success` completes it before handing over to the confirmation screen.
 */
export type OrderOverlayPhase = "sending" | "success";

const STEPS = [
  { icon: Package, label: "Pakker din ordre" },
  { icon: Send, label: "Sender til TechBoks" },
  { icon: ShieldCheck, label: "Bekræfter modtagelsen" },
];

/** Layer widths bottom → top — the stack prints itself into a small box with a lid. */
const LAYERS = [104, 104, 96, 92, 92, 92, 92, 92, 92, 92, 96, 104, 100];
const LAYER_H = 7;
const LAYER_GAP = 1;
const BASE_Y = 131;
const CENTER_X = 110;
const STACK_HEIGHT = (LAYERS.length - 1) * (LAYER_H + LAYER_GAP);
/** One full print loop, in seconds. */
const CYCLE = 3.6;
/** Fraction of the cycle spent laying down layers; the rest holds the finished box. */
const PRINT_SPAN = 0.72;
/** Fade-out duration of the overlay, in ms. */
const EXIT_MS = 350;

export function OrderProgressOverlay({
  phase,
  onFinished,
}: {
  phase: OrderOverlayPhase | null;
  /** Called once the completion beat has played out. */
  onFinished: () => void;
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
          key="order-overlay"
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
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
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
            aria-label="Sender din ordre"
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
                TechBoks · Ordre
              </span>
              <motion.span className="font-display text-canvas/80 text-sm font-semibold tabular-nums">
                {percent}
              </motion.span>
            </div>

            <PrintScene done={done} reduced={reduced} />

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
                    {done ? "Ordren er modtaget" : "Sender din ordre"}
                    {!done && <AnimatedDots />}
                  </h2>
                  <p className="text-canvas/55 mx-auto mt-2 max-w-xs text-sm leading-relaxed">
                    {done
                      ? "Alt gik igennem. Vi klargør din bekræftelse."
                      : "Hold vinduet åbent — vi taler med serveren lige nu."}
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
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="via-canvas/70 absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent to-transparent"
                />
              )}
            </div>

            {/* Steps. */}
            <ul className="mt-6 space-y-2.5" aria-live="polite">
              {STEPS.map((step, i) => {
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
                          transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                          className="border-accent-mint absolute inset-0 rounded-full border"
                        />
                      )}
                      <AnimatePresence mode="wait" initial={false}>
                        {state === "done" ? (
                          <motion.span
                            key="check"
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 18,
                            }}
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
                  Det tager lidt længere end normalt — din ordre er stadig på vej.
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

/**
 * A 3D printer laying down the order, layer by layer — the wait rendered as
 * the thing the customer is actually waiting for.
 */
function PrintScene({ done, reduced }: { done: boolean; reduced: boolean }) {
  return (
    <div className="relative mx-auto mt-6 w-full max-w-[17rem]">
      <svg viewBox="0 0 220 170" className="h-auto w-full" aria-hidden>
        {/* Printer frame. */}
        <g className="text-canvas/12" fill="currentColor">
          <rect x="14" y="12" width="7" height="136" rx="3.5" />
          <rect x="199" y="12" width="7" height="136" rx="3.5" />
          <rect x="14" y="12" width="192" height="7" rx="3.5" />
        </g>

        {/* Heat glow under the plate. */}
        <motion.ellipse
          cx={CENTER_X}
          cy={152}
          rx={62}
          ry={7}
          className="text-accent-mint"
          fill="currentColor"
          style={{ filter: "blur(7px)" }}
          animate={reduced ? { opacity: 0.3 } : { opacity: [0.18, 0.4, 0.18] }}
          transition={{
            duration: 2.4,
            repeat: reduced ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Build plate. */}
        <g className="text-canvas/30" fill="currentColor">
          <rect x="32" y="139" width="156" height="8" rx="4" />
        </g>

        {/* Printed layers. */}
        <g fill="currentColor">
          {LAYERS.map((width, i) => {
            const y = BASE_Y - i * (LAYER_H + LAYER_GAP);
            const isLid = i >= LAYERS.length - 2;
            const appear = 0.02 + (i / LAYERS.length) * PRINT_SPAN;
            return (
              <motion.rect
                key={i}
                x={CENTER_X - width / 2}
                y={y}
                width={width}
                height={LAYER_H}
                rx={2.5}
                className={isLid ? "text-accent-mint" : "text-canvas/85"}
                initial={false}
                animate={
                  done || reduced
                    ? { opacity: 1, y: 0 }
                    : { opacity: [0, 0, 1, 1, 0], y: [7, 7, 0, 0, 0] }
                }
                transition={
                  done || reduced
                    ? {
                        duration: 0.4,
                        delay: done ? i * 0.015 : 0,
                        ease: "easeOut",
                      }
                    : {
                        duration: CYCLE,
                        times: [0, appear, appear + 0.05, 0.9, 1],
                        repeat: Infinity,
                        ease: "easeOut",
                      }
                }
              />
            );
          })}
        </g>

        {/* Carriage: rises through the stack while the head sweeps side to side. */}
        {!reduced && (
          <motion.g
            initial={false}
            animate={
              done
                ? { y: -(STACK_HEIGHT + 26), opacity: 0 }
                : {
                    y: [0, -STACK_HEIGHT, -STACK_HEIGHT, -STACK_HEIGHT],
                    opacity: [0, 1, 1, 0],
                  }
            }
            transition={
              done
                ? { duration: 0.5, ease: "easeIn" }
                : {
                    duration: CYCLE,
                    times: [0.02, PRINT_SPAN, 0.9, 1],
                    repeat: Infinity,
                    ease: "linear",
                  }
            }
          >
            {/* Gantry bar. */}
            <rect
              x="17"
              y="119"
              width="186"
              height="5"
              rx="2.5"
              className="text-canvas/20"
              fill="currentColor"
            />
            <motion.g
              animate={{ x: [-32, 32, -32] }}
              transition={{
                duration: 1.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Extrusion glow. */}
              <motion.circle
                cx={CENTER_X}
                cy={133}
                r={6}
                className="text-accent-mint"
                fill="currentColor"
                style={{ filter: "blur(4px)" }}
                animate={{ opacity: [0.35, 0.8, 0.35] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Print head. */}
              <rect
                x={CENTER_X - 17}
                y={110}
                width="34"
                height="14"
                rx="4"
                className="text-canvas/70"
                fill="currentColor"
              />
              <rect
                x={CENTER_X - 10}
                y={113}
                width="20"
                height="3"
                rx="1.5"
                className="text-ink/70"
                fill="currentColor"
              />
              {/* Nozzle. */}
              <path
                d={`M ${CENTER_X - 6} 124 L ${CENTER_X + 6} 124 L ${CENTER_X + 2.5} 132 L ${CENTER_X - 2.5} 132 Z`}
                className="text-canvas/85"
                fill="currentColor"
              />
              {/* Filament bead. */}
              <motion.rect
                x={CENTER_X - 1.5}
                y={131}
                width="3"
                height="4"
                rx="1.5"
                className="text-accent-mint"
                fill="currentColor"
                animate={{ opacity: [0.4, 1, 0.4], scaleY: [0.7, 1, 0.7] }}
                transition={{
                  duration: 0.45,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.g>
          </motion.g>
        )}

        {/* Completion badge. */}
        <AnimatePresence>
          {done && (
            <motion.g
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: 0.25,
              }}
              style={{ transformOrigin: "110px 88px" }}
            >
              <motion.circle
                cx={CENTER_X}
                cy={88}
                r={26}
                className="text-accent-mint"
                fill="currentColor"
                animate={{ opacity: [0, 0.35, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                style={{ filter: "blur(6px)" }}
              />
              <circle
                cx={CENTER_X}
                cy={88}
                r={22}
                className="text-accent-mint"
                fill="currentColor"
              />
              <motion.path
                d={`M ${CENTER_X - 10} 88 L ${CENTER_X - 3} 95 L ${CENTER_X + 11} 81`}
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
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}

/** Small mint burst when the order lands. */
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
