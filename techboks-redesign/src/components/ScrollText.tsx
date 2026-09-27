import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useMounted } from "@/hooks/use-mounted";

/** Word-by-word opacity reveal driven by scroll position (Coda-style). */
export function ScrollText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");
  const mounted = useMounted();

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          active={mounted}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  active,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  active: boolean;
}) {
  // Starts at 0.5, not lower: the faded words still need 3:1 contrast
  // (large text) against the canvas. Fully visible in the server HTML.
  const opacity = useTransform(progress, range, [0.5, 1]);
  return (
    <span className="mr-[0.28em] inline-block">
      <motion.span style={active ? { opacity } : {}} className="inline-block">
        {children}
      </motion.span>
    </span>
  );
}
