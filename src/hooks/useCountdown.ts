"use client";

import { useEffect, useState } from "react";
import { getCountdownParts, type CountdownParts } from "@/lib/dateUtils";

/**
 * Countdown en tiempo real hasta `targetTime` (epoch ms).
 * Devuelve null mientras no haya objetivo o hasta el primer tick,
 * por lo que es seguro en SSR. Limpia sus timers al desmontar.
 */
export function useCountdown(targetTime: number | null): CountdownParts | null {
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    if (targetTime === null) return;
    const target = new Date(targetTime);
    let cancelled = false;
    const tick = () => {
      if (!cancelled) setParts(getCountdownParts(target));
    };
    // Primer tick diferido para no llamar setState de forma síncrona en el efecto.
    const firstTick = window.setTimeout(tick, 0);
    const intervalId = window.setInterval(tick, 1000);
    return () => {
      cancelled = true;
      window.clearTimeout(firstTick);
      window.clearInterval(intervalId);
    };
  }, [targetTime]);

  return targetTime === null ? null : parts;
}
