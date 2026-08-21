"use client";

import { relationshipConfig } from "@/config/relationship";
import {
  getNextAnniversary,
  isValidDateString,
} from "@/lib/dateUtils";
import { useCountdown } from "@/hooks/useCountdown";
import { useMounted } from "@/hooks/useMounted";

function PlaceholderNote({ text }: { text: string }) {
  return <p className="text-sm text-wine-soft">{text}</p>;
}

/** Cuenta regresiva en tiempo real al próximo aniversario. */
export default function AnniversaryCounter() {
  const config = relationshipConfig;
  const dateSource = isValidDateString(config.anniversaryDate)
    ? config.anniversaryDate
    : config.relationshipStartDate;
  const valid = isValidDateString(dateSource);

  const mounted = useMounted();
  const target = mounted && valid ? (getNextAnniversary(dateSource)?.getTime() ?? null) : null;
  const parts = useCountdown(target);

  return (
    <article className="rounded-3xl border border-rose/15 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      <h3 className="font-display text-xl font-bold text-wine">
        Nuestro próximo aniversario 💕
      </h3>

      {!valid && (
        <div className="mt-4">
          <PlaceholderNote text="Configura la fecha de aniversario en src/config/relationship.ts para activar la cuenta regresiva ✨" />
        </div>
      )}

      {valid && !parts && (
        <p className="mt-4 text-sm text-wine-soft">Calculando... 💭</p>
      )}

      {valid && parts?.isToday && (
        <p className="mt-4 text-2xl font-bold text-rose-deep">
          ¡HOY ES NUESTRO DÍA! ❤️
        </p>
      )}

      {valid && parts && !parts.isToday && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { value: parts.days, label: "días" },
            { value: parts.hours, label: "horas" },
            { value: parts.minutes, label: "min" },
            { value: parts.seconds, label: "seg" },
          ].map((unit) => (
            <div
              key={unit.label}
              className="rounded-xl bg-blush/50 px-2 py-3 text-center"
            >
              <p className="font-display text-2xl font-bold text-rose-deep tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </p>
              <p className="text-[11px] font-semibold tracking-wide text-wine-soft uppercase">
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
