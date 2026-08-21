import Image from "next/image";
import SectionHeading from "./SectionHeading";

const PHOTO_LAYOUTS = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
];

const PHOTOS = PHOTO_LAYOUTS.map((layout, index) => ({
  src: `/us/hannia_${index + 1}.jpeg`,
  alt: `Hannia, foto ${index + 1}`,
  layout,
}));

/** Collage coqueto con los recuerdos visuales de Hannia. */
export default function HanniaCollage() {
  return (
    <div>
      <SectionHeading
        emoji="📸"
        title="La protagonista de mi galería ✨"
      />

      <div className="relative overflow-hidden rounded-[2.5rem] border border-rose/20 bg-night p-3 shadow-xl shadow-rose/10 sm:p-5">
        <div aria-hidden="true" className="absolute -top-24 -right-20 size-72 rounded-full bg-rose/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-28 -left-20 size-72 rounded-full bg-goo/10 blur-3xl" />

        <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3 px-2 sm:px-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-blush uppercase">
              Colección oficial
            </p>
            <h3 className="font-display mt-1 text-2xl font-bold text-cream sm:text-3xl">
              Hannia en 13 versiones 💕
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cream/75">
            <span className="rounded-full border border-rose/30 bg-rose/15 px-3 py-1.5">🌺 Yucatán</span>
            <span aria-hidden="true" className="text-rose">↔</span>
            <span className="rounded-full border border-rose/30 bg-rose/15 px-3 py-1.5">♨️ Aguascalientes</span>
          </div>
        </div>

        <div className="relative grid grid-flow-dense auto-rows-[120px] grid-cols-2 gap-1 sm:auto-rows-[145px] sm:grid-cols-4 sm:gap-2">
          {PHOTOS.map(({ src, alt, layout }, index) => (
            <figure
              key={src}
              className={`group relative overflow-hidden rounded-2xl border border-white/15 bg-night-soft shadow-lg transition duration-500 hover:z-10 hover:-translate-y-1 hover:-rotate-1 hover:shadow-2xl hover:shadow-rose/20 ${layout}`}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent opacity-70" />
              <figcaption className="absolute right-2 bottom-2 rounded-full bg-night/60 px-2 py-1 text-[10px] font-bold text-cream backdrop-blur-sm">
                {String(index + 1).padStart(2, "0")} / 13
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="relative mt-4 flex items-center justify-center gap-2 text-center text-sm text-cream/70">
          <span aria-hidden="true">💌</span>
          <p>Todavía no tenemos fotos juntos, pero ya tenemos una historia bonita que seguir llenando.</p>
          <span aria-hidden="true">💌</span>
        </div>
      </div>
    </div>
  );
}
