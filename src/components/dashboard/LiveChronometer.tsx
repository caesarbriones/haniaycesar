"use client";

import { useElapsedTime } from "@/hooks/useElapsedTime";

interface LiveChronometerProps {
  startTime: number | null;
}

/**
 * Cronómetro en vivo: días, horas, minutos, segundos y centésimas
 * desde que oficialmente son novios.
 */
export default function LiveChronometer({ startTime }: LiveChronometerProps) {
  const elapsed = useElapsedTime(startTime);

  if (!elapsed) {
    return (
      <p className="mt-6 text-sm text-wine-soft">Iniciando cronómetro... ⏱️</p>
    );
  }

  const units = [
    { value: String(elapsed.days), label: elapsed.days === 1 ? "día" : "días" },
    { value: String(elapsed.hours).padStart(2, "0"), label: "horas" },
    { value: String(elapsed.minutes).padStart(2, "0"), label: "min" },
    { value: String(elapsed.seconds).padStart(2, "0"), label: "seg" },
  ];

  return (
    <div className="mt-8" role="timer" aria-label={`Llevamos ${elapsed.days} días, ${elapsed.hours} horas, ${elapsed.minutes} minutos y ${elapsed.seconds} segundos como novios`}>
      <p className="text-sm font-semibold tracking-[0.25em] text-rose uppercase">
        Llevamos oficialmente
      </p>

      <div className="mt-4 flex flex-wrap items-stretch justify-center gap-2 sm:gap-3">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="min-w-[4.5rem] rounded-2xl border border-rose/15 bg-white/70 px-3 py-3 shadow-sm backdrop-blur-sm sm:min-w-20"
          >
            <p className="font-display text-3xl font-bold text-rose-deep tabular-nums sm:text-4xl">
              {unit.value}
            </p>
            <p className="text-[10px] font-semibold tracking-wide text-wine-soft uppercase">
              {unit.label}
            </p>
          </div>
        ))}

        {/* Centésimas: el detalle que hace sentir el cronómetro vivo */}
        <div className="flex min-w-[4.5rem] flex-col justify-center rounded-2xl border-2 border-dashed border-rose/30 bg-blush/40 px-3 py-3 sm:min-w-20">
          <p className="font-display text-2xl font-bold text-rose tabular-nums sm:text-3xl">
            .{String(elapsed.ms).padStart(2, "0")}
          </p>
          <p className="text-[10px] font-semibold tracking-wide text-wine-soft uppercase">
            centésimas
          </p>
        </div>
      </div>

      <p className="mt-4 text-wine-soft">
        y cada milisegundo cuenta ❤️
      </p>
    </div>
  );
}
