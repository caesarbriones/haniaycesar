"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { relationshipConfig } from "@/config/relationship";
import { formatDateEs, isValidDateString, parseDate } from "@/lib/dateUtils";
import { useMounted } from "@/hooks/useMounted";
import LiveChronometer from "./LiveChronometer";
import TimePlayground from "./TimePlayground";

/** Hero del universo: nombres, corazón (con secreto), fechas claras y cronómetro en vivo. */
export default function RelationshipHero() {
  const mounted = useMounted();
  const hasStart = isValidDateString(relationshipConfig.relationshipStartDate);
  const hasMet = isValidDateString(relationshipConfig.metDate);
  const startTime =
    mounted && hasStart
      ? (parseDate(relationshipConfig.relationshipStartDate)?.getTime() ?? null)
      : null;

  // Easter egg: tocar el corazón 5 veces activa el "modo cursi".
  const [heartClicks, setHeartClicks] = useState(0);
  const [secretFound, setSecretFound] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleHeartClick = () => {
    const next = heartClicks + 1;
    setHeartClicks(next);
    if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => setHeartClicks(0), 2000);
    if (next >= 5) {
      setSecretFound(true);
      setHeartClicks(0);
    }
  };

  return (
    <section id="inicio" className="relative scroll-mt-28 overflow-hidden px-6 pt-24 pb-16">
      {/* Blobs decorativos */}
      <div
        aria-hidden="true"
        className="absolute -top-20 -left-20 size-72 animate-float-y rounded-full bg-blush/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-16 bottom-10 size-80 animate-float-y rounded-full bg-rose/20 blur-3xl [animation-delay:1.4s]"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center"
      >
        <p className="text-sm font-semibold tracking-[0.3em] text-rose uppercase">
          Bienvenida a
        </p>

        <h1 className="font-display mt-3 text-5xl font-bold text-wine sm:text-7xl">
          {relationshipConfig.partnerName}{" "}
          <span className="text-rose">&</span> {relationshipConfig.yourName}
        </h1>

        {/* Corazón principal latiendo (esconde un secreto: tócalo 5 veces) */}
        <motion.button
          type="button"
          onClick={handleHeartClick}
          aria-label="Nuestro corazón"
          whileTap={{ scale: 1.35 }}
          className="my-5 animate-heartbeat cursor-pointer text-6xl select-none sm:text-7xl"
        >
          ❤️
        </motion.button>

        <div aria-live="polite" className="min-h-8">
          <AnimatePresence>
            {secretFound && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-semibold text-rose-deep"
              >
                ¡Encontraste un secreto! Modo cursi: ACTIVADO 😌❤️
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <p className="font-display text-2xl text-wine-soft italic sm:text-3xl">
          Nuestro pequeño universo
        </p>

        {/* Las dos fechas importantes, claritas */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {hasMet && (
            <span className="rounded-full border border-rose/20 bg-white/70 px-4 py-1.5 text-sm font-medium text-wine shadow-sm">
              ✨ Nos conocimos: {formatDateEs(relationshipConfig.metDate)}
            </span>
          )}
          {hasStart && (
            <span className="rounded-full border border-rose/20 bg-white/70 px-4 py-1.5 text-sm font-semibold text-rose-deep shadow-sm">
              💕 Oficialmente novios: {formatDateEs(relationshipConfig.relationshipStartDate)}
            </span>
          )}
        </div>

        {hasStart ? (
          <LiveChronometer startTime={startTime} />
        ) : (
          <p className="mx-auto mt-8 max-w-md rounded-2xl border border-rose/15 bg-white/70 px-6 py-4 text-wine-soft shadow-sm">
            Cuando agregues su fecha de inicio en{" "}
            <code className="rounded bg-blush/70 px-1.5 py-0.5 text-sm">
              src/config/relationship.ts
            </code>
            , aquí aparecerá el cronómetro de su amor 💕
          </p>
        )}
      </motion.div>

      {hasStart && (
        <div className="relative mx-auto w-full max-w-5xl">
          <TimePlayground startTime={startTime} />
        </div>
      )}
    </section>
  );
}
