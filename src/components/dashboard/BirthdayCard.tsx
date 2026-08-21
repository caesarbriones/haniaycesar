"use client";

import {
  formatDateEs,
  getDaysUntil,
  getNextBirthday,
  isValidDateString,
} from "@/lib/dateUtils";
import { useMounted } from "@/hooks/useMounted";

/** Tarjeta con la cuenta regresiva al cumpleaños indicado. */
interface BirthdayCardProps {
  birthday: string;
  title: string;
}

export default function BirthdayCard({ birthday, title }: BirthdayCardProps) {
  const valid = isValidDateString(birthday);

  const mounted = useMounted();
  const next = mounted && valid ? getNextBirthday(birthday) : null;
  const daysUntil = next ? getDaysUntil(next) : null;

  return (
    <article className="rounded-3xl border border-rose/15 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      <h3 className="font-display text-xl font-bold text-wine">
        {title}
      </h3>

      {!valid && (
        <p className="mt-4 text-sm text-wine-soft">
          Configura el cumpleaños en src/config/relationship.ts para saber cuántos
          días faltan 🎈
        </p>
      )}

      {valid && daysUntil === null && (
        <p className="mt-4 text-sm text-wine-soft">Calculando... 💭</p>
      )}

      {valid && daysUntil === 0 && (
        <p className="mt-4 text-2xl font-bold text-rose-deep">
          ¡HOY ES SU DÍA! 🎂🥳❤️
        </p>
      )}

      {valid && daysUntil !== null && daysUntil > 0 && (
        <div className="mt-4">
          <p className="text-lg text-wine">
            Faltan{" "}
            <span className="font-display text-3xl font-bold text-rose-deep tabular-nums">
              {daysUntil}
            </span>{" "}
            {daysUntil === 1 ? "día" : "días"}
          </p>
          <p className="mt-1 text-sm text-wine-soft">
            {formatDateEs(next)} — ve preparando algo bonito 👀
          </p>
        </div>
      )}
    </article>
  );
}
