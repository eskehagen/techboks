import { useScroll, useSpring, useTransform, motion, useVelocity, useMotionValue, useAnimationFrame } from "motion/react";
import { useRef } from "react";

/**
 * Infinite ticker whose speed and direction react to scroll velocity.
 */
export function Marquee({ items, baseSpeed = 40 }: { items: string[]; baseSpeed?: number }) {
  const row = [...items, ...items];
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1500, 0, 1500], [-4, 1, 4], { clamp: false });

  useAnimationFrame((_, delta) => {
    const width = trackRef.current ? trackRef.current.scrollWidth / 2 : 1;
    const move = (baseSpeed * (delta / 1000) * factor.get()) % width;
    let next = x.get() - move;
    if (next <= -width) next += width;
    if (next > 0) next -= width;
    x.set(next);
  });

  return (
    <div className="group bg-ink text-canvas relative overflow-hidden rounded-full py-5">
      <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-10">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display flex shrink-0 items-center gap-10 text-lg font-medium tracking-tight whitespace-nowrap sm:text-xl"
          >
            {item}
            <span className="bg-accent-mint inline-block h-1.5 w-1.5 rounded-full" aria-hidden />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
