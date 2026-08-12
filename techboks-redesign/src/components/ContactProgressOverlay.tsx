import { AnimatePresence, motion } from "motion/react";
import { MailCheck, PenLine, Send } from "lucide-react";
import {
  CompletionBadge,
  SubmitProgressOverlay,
  type SubmitOverlayPhase,
} from "@/components/SubmitProgressOverlay";

const STEPS = [
  { icon: PenLine, label: "Klargør din besked" },
  { icon: Send, label: "Sender til TechBoks" },
  { icon: MailCheck, label: "Bekræfter modtagelsen" },
];

/** The flight path from the launch pad to the inbox. */
const ARC = "M 40 126 C 78 108, 106 100, 132 82 C 150 70, 162 58, 176 44";
/** Points sampled along ARC, so the plane tracks the line it draws. */
const FLIGHT_X = [40, 67, 90, 112, 132, 155, 176, 176];
const FLIGHT_Y = [126, 114, 104, 94, 82, 63, 44, 44];
const FLIGHT_ROTATE = [-24, -24, -24, -27, -35, -41, -42, -42];
const FLIGHT_TIMES = [0, 0.13, 0.26, 0.39, 0.52, 0.65, 0.78, 1];
/** One full flight loop, in seconds. */
const CYCLE = 2.8;

/** The contact overlay: the message takes off and flies to the inbox. */
export function ContactProgressOverlay({
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
      label="Sender din besked"
      eyebrow="TechBoks · Besked"
      steps={STEPS}
      headline={{ sending: "Sender din besked", done: "Beskeden er sendt" }}
      description={{
        sending: "Hold vinduet åbent — beskeden er på vej afsted.",
        done: "Tak! Jeg vender tilbage hurtigst muligt.",
      }}
      slowHint="Det tager lidt længere end normalt — din besked er stadig på vej."
      scene={(state) => <MessageScene {...state} />}
    />
  );
}

/**
 * A paper plane carrying the message from the launch pad to the inbox, drawing
 * its own flight path as it goes.
 */
function MessageScene({ done, reduced }: { done: boolean; reduced: boolean }) {
  return (
    <>
      {/* Everything but the badge steps back once the message has landed. */}
      <motion.g animate={{ opacity: done ? 0.3 : 1 }} transition={{ duration: 0.45 }}>
        {/* Ground line and launch pad. */}
        <g className="text-canvas/12" fill="currentColor">
          <rect x="14" y="150" width="192" height="4" rx="2" />
        </g>
        <g className="text-canvas/18" fill="currentColor">
          <rect x="18" y="134" width="48" height="9" rx="4.5" />
        </g>

        {/* Launch glow. */}
        <motion.ellipse
          cx={42}
          cy={134}
          rx={26}
          ry={6}
          className="text-accent-mint"
          fill="currentColor"
          style={{ filter: "blur(6px)" }}
          animate={reduced ? { opacity: 0.28 } : { opacity: [0.15, 0.45, 0.15] }}
          transition={{
            duration: CYCLE,
            repeat: reduced ? 0 : Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Dashed route hint. */}
        <path
          d={ARC}
          className="text-canvas/15"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeDasharray="3 9"
          strokeLinecap="round"
        />

        {/* Trail drawn by the plane. */}
        <motion.path
          d={ARC}
          className="text-accent-mint"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={false}
          animate={
            done || reduced
              ? { pathLength: 1, opacity: 0.75 }
              : { pathLength: [0, 1, 1], opacity: [0.85, 0.85, 0] }
          }
          transition={
            done || reduced
              ? { duration: 0.5, ease: "easeOut" }
              : {
                  duration: CYCLE,
                  times: [0, 0.78, 1],
                  repeat: Infinity,
                  ease: "linear",
                }
          }
        />

        {/* Inbox — pulses as the message arrives. */}
        <motion.g
          style={{ transformOrigin: "182px 32px" }}
          animate={done || reduced ? { scale: 1 } : { scale: [1, 1, 1.09, 1] }}
          transition={
            done || reduced
              ? { duration: 0.3 }
              : {
                  duration: CYCLE,
                  times: [0, 0.74, 0.82, 0.95],
                  repeat: Infinity,
                  ease: "easeOut",
                }
          }
        >
          <motion.circle
            cx={182}
            cy={32}
            r={30}
            className="text-accent-mint"
            fill="currentColor"
            style={{ filter: "blur(9px)" }}
            initial={false}
            animate={done || reduced ? { opacity: 0.2 } : { opacity: [0, 0, 0.4, 0] }}
            transition={
              done || reduced
                ? { duration: 0.3 }
                : {
                    duration: CYCLE,
                    times: [0, 0.74, 0.82, 1],
                    repeat: Infinity,
                    ease: "easeOut",
                  }
            }
          />
          <rect
            x="158"
            y="14"
            width="48"
            height="36"
            rx="9"
            className="text-accent-mint/70"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          />
          <path
            d="M 161 19 L 182 35 L 203 19"
            className="text-accent-mint/50"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {/* The paper plane. */}
        <motion.g
          initial={false}
          animate={
            done
              ? { x: 176, y: 44, rotate: -42, scale: 0.5, opacity: 0 }
              : reduced
                ? { x: 112, y: 94, rotate: -27, scale: 1, opacity: 1 }
                : {
                    x: FLIGHT_X,
                    y: FLIGHT_Y,
                    rotate: FLIGHT_ROTATE,
                    scale: [0.8, 1, 1, 1, 0.95, 0.9, 0.75, 0.6],
                    opacity: [0, 1, 1, 1, 1, 1, 0.55, 0],
                  }
          }
          transition={
            done
              ? { duration: 0.45, ease: "easeIn" }
              : reduced
                ? { duration: 0.4 }
                : {
                    duration: CYCLE,
                    times: FLIGHT_TIMES,
                    repeat: Infinity,
                    ease: "linear",
                  }
          }
        >
          {/* Upper wing. */}
          <path d="M -12 -9 L 14 0 L -6 0 Z" className="text-accent-mint" fill="currentColor" />
          {/* Lower wing. */}
          <path d="M -12 9 L 14 0 L -6 0 Z" className="text-canvas/85" fill="currentColor" />
          {/* Fold. */}
          <path
            d="M -12 -9 L -6 0 L -12 9"
            className="text-ink/40"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </motion.g>

        {/* Speed specks drifting past. */}
        {!reduced &&
          [0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx={0}
              cy={0}
              r={1.6}
              className="text-canvas/40"
              fill="currentColor"
              animate={{
                x: [70 + i * 34, 20 + i * 34],
                y: [136 - i * 30, 148 - i * 30],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeIn",
              }}
            />
          ))}
      </motion.g>

      <AnimatePresence>{done && <CompletionBadge cx={110} cy={90} r={24} />}</AnimatePresence>
    </>
  );
}
