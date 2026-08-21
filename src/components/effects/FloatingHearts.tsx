"use client";

import { motion } from "framer-motion";
import { mulberry32 } from "@/lib/seededRandom";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const HEARTS = ["❤️", "💕", "💖", "🩷"];
const COUNT = 12;

interface FloatingHeartSpec {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  emoji: string;
}

// Generadas a nivel de módulo con semilla fija: idénticas en SSR y cliente.
const SPECS: FloatingHeartSpec[] = (() => {
  const rand = mulberry32(20260214);
  return Array.from({ length: COUNT }, (_, i) => ({
    left: rand() * 100,
    size: 14 + rand() * 22,
    duration: 9 + rand() * 7,
    delay: rand() * 8,
    drift: (rand() - 0.5) * 60,
    emoji: HEARTS[Math.floor(rand() * HEARTS.length)] ?? HEARTS[i % HEARTS.length],
  }));
})();

/** Corazones flotando suavemente de fondo. Decorativo, no interactivo. */
export default function FloatingHearts() {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {SPECS.map((spec, index) => (
        <motion.span
          key={index}
          className="absolute select-none"
          style={{ left: `${spec.left}%`, fontSize: spec.size, top: 0 }}
          initial={{ y: "105vh", x: 0, opacity: 0 }}
          animate={{ y: "-15vh", x: [0, spec.drift, 0], opacity: [0, 0.75, 0.75, 0] }}
          transition={{
            duration: spec.duration,
            delay: spec.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {spec.emoji}
        </motion.span>
      ))}
    </div>
  );
}
