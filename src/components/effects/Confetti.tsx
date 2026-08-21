"use client";

import { motion } from "framer-motion";
import { mulberry32 } from "@/lib/seededRandom";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const COLORS = ["#f2547b", "#d63361", "#ffb9cb", "#ffd9e2", "#8ade5f", "#ffe08a"];
const HEARTS = ["❤️", "💕", "💖", "🩷"];

interface ConfettiPiece {
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  drift: number;
  color: string;
  heart: string | null;
}

// Piezas generadas con semilla fija: deterministas entre SSR y cliente.
const PIECES: ConfettiPiece[] = (() => {
  const rand = mulberry32(4451);
  return Array.from({ length: 70 }, () => {
    const isHeart = rand() < 0.35;
    return {
      left: rand() * 100,
      size: isHeart ? 14 + rand() * 14 : 6 + rand() * 8,
      duration: 3 + rand() * 2.5,
      delay: rand() * 1.4,
      rotate: rand() * 720 - 360,
      drift: (rand() - 0.5) * 120,
      color: COLORS[Math.floor(rand() * COLORS.length)],
      heart: isHeart ? HEARTS[Math.floor(rand() * HEARTS.length)] : null,
    };
  });
})();

/** Lluvia infinita de confeti y corazones para la celebración. */
export default function Confetti() {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {PIECES.map((piece, index) => (
        <motion.span
          key={index}
          className="absolute select-none"
          style={
            piece.heart
              ? { left: `${piece.left}%`, top: 0, fontSize: piece.size }
              : {
                  left: `${piece.left}%`,
                  top: 0,
                  width: piece.size,
                  height: piece.size * 0.6,
                  backgroundColor: piece.color,
                  borderRadius: 2,
                }
          }
          initial={{ y: "-12vh", x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "112vh", x: piece.drift, rotate: piece.rotate }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            repeat: Infinity,
            repeatDelay: 0.4,
            ease: "linear",
          }}
        >
          {piece.heart}
        </motion.span>
      ))}
    </div>
  );
}
