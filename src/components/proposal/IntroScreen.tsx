"use client";

import { motion } from "framer-motion";
import GlowButton from "./GlowButton";

interface IntroScreenProps {
  onContinue: () => void;
  onSkip: () => void;
}

/** Pantalla inicial: contexto de cómo empezó todo + botón continuar. */
export default function IntroScreen({ onContinue, onSkip }: IntroScreenProps) {
  return (
    <motion.section
      className="relative z-10 flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
    >
      <button
        type="button"
        onClick={onSkip}
        aria-label="Saltar declaración"
        className="absolute top-5 right-5 cursor-pointer rounded-full border border-wine/15 bg-white/60 px-4 py-2 text-sm font-semibold text-wine-soft shadow-sm backdrop-blur-sm transition-colors hover:bg-white/85 hover:text-wine"
      >
        Saltar ⏭️
      </button>

      <motion.p
        className="text-2xl text-wine-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Espera... 👀
      </motion.p>

      <motion.h1
        className="font-display max-w-xl text-4xl font-bold text-wine sm:text-5xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        De todas las personas que podían aparecer en Roblox, apareciste tú.
      </motion.h1>

      <motion.p
        className="max-w-md text-xl text-wine-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.2, duration: 0.6 }}
      >
        Y aunque llevamos poquito de conocernos, ya hay algo que quiero preguntarte 🥹
      </motion.p>

      <GlowButton delay={4.4} onClick={onContinue}>
        Recordar cómo empezó ❤️
      </GlowButton>
    </motion.section>
  );
}
