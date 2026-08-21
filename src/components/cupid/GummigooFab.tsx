import Image from "next/image";

/** Acceso rápido al consejero Gummigoo desde cualquier parte del dashboard. */
export default function GummigooFab() {
  return (
    <a
      href="#gummigoo"
      aria-label="Abrir el chat de Gummigoo"
      className="fixed right-4 bottom-24 z-40 flex items-center gap-2 rounded-full border-2 border-goo/60 bg-night/95 p-1.5 text-sm font-semibold text-cream shadow-xl shadow-goo/20 backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-goo/30 md:right-6 md:bottom-6"
    >
      <span className="relative size-11 overflow-hidden rounded-full border border-goo/50 bg-goo/15">
        <Image
          src="/gummigoo.jpeg"
          alt=""
          fill
          sizes="44px"
          className="object-cover"
        />
      </span>
      <span className="hidden pr-3 sm:inline">Habla con Gummigoo</span>
    </a>
  );
}
