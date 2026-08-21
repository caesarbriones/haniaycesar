"use client";

import { motion } from "framer-motion";
import { useElapsedTime } from "@/hooks/useElapsedTime";

interface TimePlaygroundProps {
  startTime: number | null;
}

interface Activity {
  emoji: string;
  label: string;
  /** Cantidad que "cabe" en una hora. */
  perHour: number;
  decimals: number;
}

const ACTIVITIES: Activity[] = [
  { emoji: "❤️", label: "Latidos de nuestros corazones latiendo a la vez", perHour: 8_400, decimals: 0 },
  { emoji: "🐌", label: "Metros que un caracol ya habría avanzado rumbo a Mérida", perHour: 48, decimals: 1 },
  { emoji: "🍝", label: "Platos de fettuccine que podríamos haber cocinado", perHour: 4, decimals: 1 },
  { emoji: "☕", label: "Cafés que nos hubiéramos tomado juntos", perHour: 3, decimals: 1 },
  { emoji: "💿", label: "Discos completos que podríamos haber escuchado", perHour: 1.5, decimals: 1 },
  { emoji: "✈️", label: "Vuelos Aguascalientes → Mérida", perHour: 0.61, decimals: 2 },
  { emoji: "📖", label: "Libros que podríamos haber leído juntos", perHour: 0.2, decimals: 2 },
  { emoji: "🎬", label: "Veces viendo Interestelar (2 h 49 min)", perHour: 0.355, decimals: 2 },
];

/**
 * "¿Qué cabe en este tiempo?": conversiones creativas del tiempo que
 * llevan como novios, calculadas en tiempo real con el cronómetro.
 */
export default function TimePlayground({ startTime }: TimePlaygroundProps) {
  const elapsed = useElapsedTime(startTime);
  const totalHours = elapsed?.totalHours ?? 0;

  return (
    <div className="mt-14 w-full">
      <header className="mb-6 text-center">
        <h2 className="font-display text-2xl font-bold text-wine sm:text-3xl">
          ¿Qué cabe en este tiempo? ⏳
        </h2>
        <p className="mt-2 text-wine-soft">
          Cosas que ya podríamos haber hecho juntos (científicamente calculado 😌)
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ACTIVITIES.map((activity, index) => (
          <motion.li
            key={activity.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="flex flex-col items-center rounded-2xl border border-rose/15 bg-white/70 p-4 text-center shadow-sm backdrop-blur-sm"
          >
            <span aria-hidden="true" className="text-2xl">
              {activity.emoji}
            </span>
            <p className="font-display mt-2 text-xl font-bold text-rose-deep tabular-nums sm:text-2xl">
              {(totalHours * activity.perHour).toLocaleString("es-MX", {
                minimumFractionDigits: activity.decimals,
                maximumFractionDigits: activity.decimals,
              })}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-wine-soft">{activity.label}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
