import type { Fact } from "@/config/relationship";
import SectionHeading from "./SectionHeading";

interface FactsSectionProps {
  emoji: string;
  title: string;
  subtitle?: string;
  facts: Fact[];
}

function isPlaceholder(value: string): boolean {
  return value.includes("[");
}

/** Rejilla de tarjetas con datos sobre una persona. */
export default function FactsSection({ emoji, title, subtitle, facts }: FactsSectionProps) {
  return (
    <div>
      <SectionHeading emoji={emoji} title={title} subtitle={subtitle} />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((fact) => (
          <li
            key={fact.label}
            className="rounded-2xl border border-rose/15 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-rose/15"
          >
            <span aria-hidden="true" className="text-3xl">
              {fact.icon}
            </span>
            <p className="mt-2 text-xs font-semibold tracking-wide text-wine-soft uppercase">
              {fact.label}
            </p>
            <p
              className={`mt-1 font-semibold ${
                isPlaceholder(fact.value)
                  ? "text-wine-soft/70 italic"
                  : "text-wine"
              }`}
            >
              {fact.value}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
