"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  onClick: () => void;
  delay?: number;
  className?: string;
}

/** Botón principal rosa con aparición suave y microinteracciones. */
export default function GlowButton({ children, onClick, delay = 0, className = "" }: GlowButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className={`cursor-pointer rounded-full bg-gradient-to-r from-rose to-rose-deep px-8 py-4 text-lg font-bold text-white shadow-xl shadow-rose/40 transition-shadow hover:shadow-2xl hover:shadow-rose/50 ${className}`}
    >
      {children}
    </motion.button>
  );
}
