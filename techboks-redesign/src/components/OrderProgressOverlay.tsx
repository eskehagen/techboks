import { AnimatePresence, motion } from "motion/react";
import { Package, Send, ShieldCheck } from "lucide-react";
import {
  CompletionBadge,
  SubmitProgressOverlay,
  type SubmitOverlayPhase,
} from "@/components/SubmitProgressOverlay";

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

/** The order overlay: a 3D printer building the order while it is submitted. */
export function OrderProgressOverlay({
  phase,
  onFinished,
}: {
  phase: SubmitOverlayPhase | null;
  onFinished: () => void;
}) {
  return (
    <SubmitProgressOverlay
      phase={phase}
      onFinished={onFinished}
      label="Sender din ordre"
      eyebrow="TechBoks · Ordre"
      steps={STEPS}
      headline={{ sending: "Sender din ordre", done: "Ordren er modtaget" }}
      description={{
        sending: "Hold vinduet åbent — vi taler med serveren lige nu.",
        done: "Alt gik igennem. Vi klargør din bekræftelse.",
      }}
      slowHint="Det tager lidt længere end normalt — din ordre er stadig på vej."
      scene={(state) => <PrintScene {...state} />}
    />
  );
}

/**
 * A 3D printer laying down the order, layer by layer — the wait rendered as
 * the thing the customer is actually waiting for.
 */
function PrintScene({ done, reduced }: { done: boolean; reduced: boolean }) {
  return (
    <>
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
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
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
              transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
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
              transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.g>
        </motion.g>
      )}

      <AnimatePresence>{done && <CompletionBadge cx={CENTER_X} cy={88} r={22} />}</AnimatePresence>
    </>
  );
}
