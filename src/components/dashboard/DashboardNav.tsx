import Image from "next/image";

const LINKS = [
  { href: "#inicio", emoji: "🏠", label: "Inicio" },
  { href: "#nosotros", emoji: "💕", label: "Nosotros" },
  { href: "#mapa", emoji: "🗺️", label: "Mapa" },
  { href: "#fechas", emoji: "📅", label: "Fechas" },
  { href: "#hannia", emoji: "👩", label: "Hannia" },
  { href: "#cesar", emoji: "👨", label: "César" },
  { href: "#historia", emoji: "📖", label: "Historia" },
  { href: "#fotos", emoji: "📸", label: "Fotos" },
  { href: "#carta", emoji: "💌", label: "Carta" },
  { href: "#playlist", emoji: "🎵", label: "Playlist" },
  { href: "#cupones", emoji: "🎟️", label: "Cupones" },
  { href: "#gummigoo", img: "/gummigoo.jpeg", label: "Gummigoo" },
];

/**
 * Navegación del universo: píldora flotante arriba en desktop,
 * barra inferior compacta en móvil.
 */
export default function DashboardNav() {
  return (
    <nav aria-label="Navegación del universo">
      {/* Desktop */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-40 hidden justify-center md:flex">
        <ul className="pointer-events-auto flex items-center gap-1 rounded-full border border-rose/20 bg-white/70 px-3 py-2 shadow-lg shadow-rose/10 backdrop-blur-md">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block rounded-full px-3 py-1.5 text-sm font-medium text-wine transition-colors hover:bg-blush/70"
              >
                {link.img ? (
                  <span className="mr-1 inline-flex size-5 overflow-hidden rounded-full border border-goo/50 align-middle shadow-sm shadow-goo/20">
                    <Image
                      src={link.img}
                      alt=""
                      width={40}
                      height={40}
                      className="size-full object-cover"
                    />
                  </span>
                ) : (
                  <span aria-hidden="true">{link.emoji}</span>
                )} {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Móvil */}
      <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
        <ul className="flex min-w-0 items-center justify-start gap-1 overflow-x-auto rounded-3xl border border-rose/20 bg-white/85 px-2 py-2 shadow-xl shadow-rose/20 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LINKS.map((link) => (
            <li className="shrink-0" key={link.href}>
              <a
                href={link.href}
                aria-label={link.label}
                className="block rounded-full p-1.5 text-lg transition-colors hover:bg-blush/70"
              >
                {link.img ? (
                  <span className="inline-flex size-6 overflow-hidden rounded-full border border-goo/50 align-middle shadow-sm shadow-goo/20">
                    <Image
                      src={link.img}
                      alt=""
                      width={48}
                      height={48}
                      className="size-full object-cover"
                    />
                  </span>
                ) : (
                  <span aria-hidden="true">{link.emoji}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
