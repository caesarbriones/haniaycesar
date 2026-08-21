"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

interface StatItem {
  icon: string;
  label: string;
  value: string;
}

/** "Estadísticas completamente científicas" de la relación. */
export default function RelationshipStats() {
  const items: StatItem[] = [
    { icon: "❤️", label: "Tiempo compartido", value: "Cada vez más" },
    { icon: "💬", label: "Mensajes", value: "Los necesarios" },
    { icon: "😂", label: "Risas", value: "Demasiadas" },
    { icon: "🌙", label: "Noches hablando", value: "Hasta tarde" },
    { icon: "🍕", label: "Comidas juntos", value: "Las suficientes" },
    { icon: "📸", label: "Fotos", value: "Una colección" },
    { icon: "🎵", label: "Canciones compartidas", value: "Una playlist entera" },
    { icon: "☕", label: "Cafés juntos", value: "Los que hagan falta" },
  ];

  // Easter egg: estadística secreta.
  const [secretRevealed, setSecretRevealed] = useState(false);

  return (
    <div>
      <SectionHeading
        emoji="📊"
        title="Estadísticas completamente científicas 😂"
        subtitle="Medidas con el laboratorio más preciso: nuestro corazón"
      />

      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.label}
            className="rounded-2xl border border-rose/15 bg-white/70 p-5 text-center shadow-sm backdrop-blur-sm"
          >
            <span aria-hidden="true" className="text-3xl">
              {item.icon}
            </span>
            <p className="font-display mt-2 text-2xl font-bold text-rose-deep tabular-nums sm:text-3xl">
              {item.value}
            </p>
            <p className="mt-1 text-xs font-semibold tracking-wide text-wine-soft uppercase">
              {item.label}
            </p>
          </li>
        ))}

        {/* Tarjeta secreta */}
        <li>
          <button
            type="button"
            onClick={() => setSecretRevealed((prev) => !prev)}
            aria-expanded={secretRevealed}
            className="h-full w-full cursor-pointer rounded-2xl border-2 border-dashed border-rose/30 bg-blush/30 p-5 text-center transition-colors hover:border-rose/50 hover:bg-blush/50"
          >
            <span aria-hidden="true" className="text-3xl">
              🤫
            </span>
            <div aria-live="polite" className="mt-2 min-h-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={secretRevealed ? "revealed" : "hidden"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="font-display text-lg font-bold text-rose-deep"
                >
                  {secretRevealed
                    ? "Probabilidad de que seamos felices: 100% 😌❤️"
                    : "???"}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="mt-1 text-xs font-semibold tracking-wide text-wine-soft uppercase">
              Estadística secreta
            </p>
          </button>
        </li>
      </ul>
    </div>
  );
}
