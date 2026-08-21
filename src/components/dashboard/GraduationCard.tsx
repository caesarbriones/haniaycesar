"use client";

import { motion } from "framer-motion";
import { relationshipConfig } from "@/config/relationship";
import {
  formatDateEs,
  getDaysUntil,
  getGraduationProgress,
  isValidDateString,
  parseDate,
} from "@/lib/dateUtils";
import { useMounted } from "@/hooks/useMounted";

/**
 * Tarjeta de la graduación. Si están configuradas las dos fechas (inicio de
 * carrera y graduación) muestra la barra de progreso; si solo está la fecha
 * de graduación, muestra la cuenta regresiva en días.
 */
export default function GraduationCard() {
  const config = relationshipConfig;
  const hasGraduation = isValidDateString(config.graduationDate);
  const hasCareerStart = isValidDateString(config.careerStartDate);

  const mounted = useMounted();
  const progress =
    mounted && hasGraduation && hasCareerStart
      ? getGraduationProgress(config.careerStartDate, config.graduationDate)
      : null;
  const graduationDay = mounted && hasGraduation ? parseDate(config.graduationDate) : null;
  const daysLeft = graduationDay ? getDaysUntil(graduationDay) : null;

  const finished = progress ? progress.finished : daysLeft === 0;
  const percent = progress ? Math.round(progress.percent) : 0;

  return (
    <article className="rounded-3xl border border-rose/15 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      <h3 className="font-display text-xl font-bold text-wine">Su gran día 🎓</h3>

      {!hasGraduation && (
        <p className="mt-4 text-sm text-wine-soft">
          Configura la fecha de graduación en src/config/relationship.ts para ver la
          cuenta regresiva 📚
        </p>
      )}

      {hasGraduation && !mounted && (
        <p className="mt-4 text-sm text-wine-soft">Calculando... 💭</p>
      )}

      {hasGraduation && mounted && finished && (
        <p className="mt-4 text-2xl font-bold text-rose-deep">LO LOGRASTE 🎓😭❤️</p>
      )}

      {/* Modo completo: barra de progreso de la carrera */}
      {hasGraduation && mounted && !finished && progress && (
        <div className="mt-4">
          <div
            className="h-4 overflow-hidden rounded-full bg-blush/60"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Porcentaje de carrera completado"
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rose to-rose-deep"
              initial={{ width: 0 }}
              whileInView={{ width: `${percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <p className="mt-3 text-lg text-wine">
            <span className="font-display text-2xl font-bold text-rose-deep tabular-nums">
              {percent}%
            </span>{" "}
            del camino recorrido
          </p>
          <p className="mt-1 text-sm text-wine-soft">
            Faltan{" "}
            <span className="font-semibold tabular-nums">{progress.daysRemaining}</span>{" "}
            días — {formatDateEs(config.graduationDate)}
          </p>
        </div>
      )}

      {/* Modo solo cuenta regresiva: aún no hay fecha de inicio de carrera */}
      {hasGraduation && mounted && !finished && !progress && daysLeft !== null && (
        <div className="mt-4">
          <p className="text-lg text-wine">
            Faltan{" "}
            <span className="font-display text-3xl font-bold text-rose-deep tabular-nums">
              {daysLeft.toLocaleString("es-MX")}
            </span>{" "}
            {daysLeft === 1 ? "día" : "días"}
          </p>
          <p className="mt-1 text-sm text-wine-soft">
            {formatDateEs(config.graduationDate)} — ya casi lo logra 📚✨
          </p>
          <p className="mt-2 text-xs text-wine-soft/70">
            Tip: agrega la fecha de inicio de la carrera en la configuración para ver la
            barra de progreso.
          </p>
        </div>
      )}
    </article>
  );
}
