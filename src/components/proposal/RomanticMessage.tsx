"use client";

import { motion } from "framer-motion";
import GlowButton from "./GlowButton";

interface RomanticMessageProps {
  onContinue: () => void;
}

/** Mensaje romántico progresivo que lleva a la gran pregunta. */
export default function RomanticMessage({ onContinue }: RomanticMessageProps) {
  return (
    <motion.section
      className="relative z-10 flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5 }}
    >
      <motion.p
        className="max-w-lg text-2xl text-wine-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Todo empezó en Roblox, de la manera más random...
      </motion.p>

      <motion.p
        className="max-w-lg text-2xl text-wine-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        Entre partidas, mensajes y momentos que no esperaba...
      </motion.p>

      <motion.p
        className="max-w-lg text-2xl text-wine-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 0.6 }}
      >
        Nos conocemos desde hace poquito...
      </motion.p>

      <motion.p
        className="font-display max-w-xl text-3xl font-bold text-wine sm:text-4xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.0, duration: 0.7 }}
      >
        Pero contigo todo se ha sentido muy natural y especial ❤️
      </motion.p>

      <motion.p
        className="mt-4 max-w-md text-xl text-wine-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5.6, duration: 0.6 }}
      >
        Así que quería preguntarte algo...
      </motion.p>

      <GlowButton delay={7.0} onClick={onContinue}>
        ¿Qué cosa? 👀
      </GlowButton>
    </motion.section>
  );
}
