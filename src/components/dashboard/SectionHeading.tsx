interface SectionHeadingProps {
  emoji: string;
  title: string;
  subtitle?: string;
}

/** Encabezado consistente para cada sección del universo. */
export default function SectionHeading({ emoji, title, subtitle }: SectionHeadingProps) {
  return (
    <header className="mb-10 text-center">
      <span aria-hidden="true" className="text-4xl">
        {emoji}
      </span>
      <h2 className="font-display mt-2 text-3xl font-bold text-wine sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-lg text-wine-soft">{subtitle}</p>}
    </header>
  );
}
