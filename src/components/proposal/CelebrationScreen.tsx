"use client";

import { motion } from "framer-motion";
import Confetti from "@/components/effects/Confetti";
import GlowButton from "./GlowButton";
import { mulberry32 } from "@/lib/seededRandom";

interface CelebrationScreenProps {
  onComplete: () => void;
}

interface BurstHeart {
  angle: number;
  distance: number;
  size: number;
  emoji: string;
}

const HEARTS = ["❤️", "💖", "💕", "💗", "🩷"];

// Explosión de corazones determinista (misma en SSR y cliente).
const BURST: BurstHeart[] = (() => {
  const rand = mulberry32(777);
  return Array.from({ length: 24 }, (_, i) => ({
    angle: (i / 24) * Math.PI * 2 + rand() * 0.35,
    distance: 120 + rand() * 170,
    size: 14 + rand() * 24,
    emoji: HEARTS[Math.floor(rand() * HEARTS.length)],
  }));
})();

const SPARKLES = ["✨", "⭐", "✨", "🌟", "✨", "⭐"];

/** Celebración al presionar SÍ: confeti, explosión de corazones y corazón gigante. */
export default function CelebrationScreen({ onComplete }: CelebrationScreenProps) {
  return (
    <motion.section
      className="relative z-10 flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.6 } }}
      transition={{ duration: 0.4 }}
    >
      <Confetti />

      {/* Explosión de corazones desde el centro */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {BURST.map((heart, index) => (
          <motion.span
            key={index}
            className="absolute select-none"
            style={{ fontSize: heart.size }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: Math.cos(heart.angle) * heart.distance,
              y: Math.sin(heart.angle) * heart.distance,
              scale: [0, 1.3, 1],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.7, delay: 0.35, ease: "easeOut" }}
          >
            {heart.emoji}
          </motion.span>
        ))}
      </div>

      {/* Destellos flotantes */}
      {SPARKLES.map((sparkle, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          className="pointer-events-none absolute animate-float-y text-3xl select-none"
          style={{
            left: `${12 + index * 15}%`,
            top: `${15 + (index % 3) * 26}%`,
            animationDelay: `${index * 0.7}s`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1] }}
          transition={{ delay: 1 + index * 0.3, duration: 2 }}
        >
          {sparkle}
        </motion.span>
      ))}

      <motion.div
        aria-hidden="true"
        className="animate-heartbeat text-8xl select-none sm:text-9xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
      >
        💖
      </motion.div>

      <motion.h2
        className="font-display mt-8 max-w-2xl text-4xl font-bold text-wine sm:text-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        ¡MIRA HASTA DÓNDE LLEGÓ ESA PARTIDA DE ROBLOX! 💖
      </motion.h2>

      <motion.p
        className="mt-5 max-w-md text-2xl text-wine-soft"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        Nos conocemos desde hace poquito, pero me encanta todo lo que ha empezado
        entre nosotros 🥹❤️
      </motion.p>

      <div className="mt-6">
        <GlowButton delay={3.0} onClick={onComplete}>
          Conocer nuestro pequeño universo ❤️
        </GlowButton>
      </div>
    </motion.section>
  );
}
