"use client";

import { useEffect, useState } from "react";

export interface ElapsedTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ms: number;
  totalMs: number;
  totalMinutes: number;
  totalHours: number;
}

function computeElapsed(startTime: number): ElapsedTime {
  const totalMs = Math.max(0, Date.now() - startTime);
  const totalSeconds = Math.floor(totalMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    ms: Math.floor((totalMs % 1000) / 10), // centésimas, más estables visualmente
    totalMs,
    totalMinutes: totalMs / 60_000,
    totalHours: totalMs / 3_600_000,
  };
}

/**
 * Cronómetro en tiempo real desde `startTime` (epoch ms).
 * Se actualiza ~20 veces por segundo. Seguro en SSR (empieza en null).
 */
export function useElapsedTime(startTime: number | null): ElapsedTime | null {
  const [elapsed, setElapsed] = useState<ElapsedTime | null>(null);

  useEffect(() => {
    if (startTime === null) return;
    const intervalId = window.setInterval(() => setElapsed(computeElapsed(startTime)), 47);
    return () => window.clearInterval(intervalId);
  }, [startTime]);

  return elapsed;
}
