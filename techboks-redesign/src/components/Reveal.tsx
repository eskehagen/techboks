import { animate, motion, useInView, useMotionValue } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Scroll-triggered entrance used across the site — safe to server-render.
 *
 * It used to start every element at `opacity: 0`, which put
 * `style="opacity:0"` on most of the text in the HTML a crawler (or a visitor
 * without JavaScript) receives. Now:
 *  - server and first client render: fully visible, so hydration matches;
 *  - after mount, only elements that are NOT already on screen are hidden and
 *    faded in when scrolled to. Anything above the fold would otherwise blink.
 */
export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const opacity = useMotionValue(1);
  const offset = useMotionValue(0);
  const [armed, setArmed] = useState(false);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    opacity.set(0);
    offset.set(y);
    setArmed(true);
    // Motion values are stable and `y` is fixed per use, so this runs once.
  }, [opacity, offset, y]);

  useEffect(() => {
    if (!armed || !inView) return;
    const transition = { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const };
    const fade = animate(opacity, 1, transition);
    const rise = animate(offset, 0, transition);
    return () => {
      fade.stop();
      rise.stop();
    };
  }, [armed, inView, delay, opacity, offset]);

  return (
    <motion.div ref={ref} className={className ?? ""} style={{ opacity, y: offset }}>
      {children}
    </motion.div>
  );
}
