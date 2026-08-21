"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const HEARTS = ["❤️", "💕", "🩷", "💖"];
const MAX_TRAIL = 14;
const MIN_INTERVAL_MS = 70;
const MIN_DISTANCE_PX = 26;

interface TrailHeart {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

/** Estela de pequeños corazones que sigue al cursor (o al dedo al arrastrar). */
export default function CursorTrail() {
  const reducedMotion = usePrefersReducedMotion();
  const [hearts, setHearts] = useState<TrailHeart[]>([]);
  const counterRef = useRef(0);
  const lastRef = useRef({ time: 0, x: -999, y: -999 });

  useEffect(() => {
    if (reducedMotion) return;

    const onPointerMove = (event: PointerEvent) => {
      const now = performance.now();
      const last = lastRef.current;
      if (now - last.time < MIN_INTERVAL_MS) return;
      if (Math.hypot(event.clientX - last.x, event.clientY - last.y) < MIN_DISTANCE_PX) return;
      lastRef.current = { time: now, x: event.clientX, y: event.clientY };

      counterRef.current += 1;
      const heart: TrailHeart = {
        id: counterRef.current,
        x: event.clientX,
        y: event.clientY,
        emoji: HEARTS[counterRef.current % HEARTS.length],
      };
      setHearts((prev) => [...prev.slice(-(MAX_TRAIL - 1)), heart]);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          className="absolute select-none text-sm"
          style={{ left: heart.x, top: heart.y, translateX: "-50%", translateY: "-50%" }}
          initial={{ opacity: 0.9, scale: 0.5, y: 0 }}
          animate={{ opacity: 0, scale: 1.15, y: -34 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          onAnimationComplete={() =>
            setHearts((prev) => prev.filter((item) => item.id !== heart.id))
          }
        >
          {heart.emoji}
        </motion.span>
      ))}
    </div>
  );
}
