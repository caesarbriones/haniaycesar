"use client";

import { motion } from "framer-motion";
import { relationshipConfig, type TimelineMoment } from "@/config/relationship";
import { formatDateEs, isValidDateString } from "@/lib/dateUtils";
import SectionHeading from "./SectionHeading";

function sortMoments(moments: TimelineMoment[]): TimelineMoment[] {
  return [...moments].sort((a, b) => {
    const aValid = isValidDateString(a.date);
    const bValid = isValidDateString(b.date);
    if (aValid && bValid) return a.date.localeCompare(b.date);
    if (aValid) return -1;
    if (bValid) return 1;
    return 0;
  });
}

/** Línea de tiempo con los momentos de la relación, ordenada por fecha. */
export default function Timeline() {
  const moments = sortMoments(relationshipConfig.timeline);

  return (
    <div>
      <SectionHeading
        emoji="📖"
        title="Nuestros momentos ❤️"
        subtitle="Las páginas favoritas de nuestra historia"
      />

      <ol className="relative ml-4 border-l-2 border-rose/25 sm:ml-6">
        {moments.map((moment, index) => (
          <motion.li
            key={`${moment.title}-${index}`}
            className="relative pb-10 pl-8 last:pb-0"
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <span
              aria-hidden="true"
              className="absolute top-0 -left-[1.35rem] flex size-10 items-center justify-center rounded-full border border-rose/25 bg-white text-xl shadow-sm"
            >
              {moment.icon}
            </span>

            <p className="text-xs font-semibold tracking-wide text-rose-deep uppercase">
              {isValidDateString(moment.date) ? formatDateEs(moment.date) : "Próximamente ✨"}
            </p>
            <h3 className="font-display mt-1 text-xl font-bold text-wine">{moment.title}</h3>
            <p className="mt-1 max-w-lg text-wine-soft">{moment.description}</p>

            {moment.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={moment.image}
                alt={moment.title}
                className="mt-3 max-w-sm rounded-2xl border border-rose/15 shadow-sm"
                loading="lazy"
              />
            )}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
