"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

interface Coupon {
  id: string;
  category: string;
  emoji: string;
  title: string;
  redeemed?: boolean;
}

const WHEEL_COLORS = [
  "#ff2f7d",
  "#ffd21f",
  "#00e5c5",
  "#9b5cff",
  "#ff6b35",
  "#20cfff",
  "#ff4fd8",
];

const COUPONS: Coupon[] = [
  { id: "abrazo", category: "Románticos", emoji: "🫂", title: "Vale por un abrazo virtual de emergencia" },
  { id: "llamada", category: "Románticos", emoji: "📞", title: "Una llamada cuando tú quieras" },
  { id: "noche", category: "Románticos", emoji: "🌙", title: "Una noche completa para nosotros" },
  { id: "carta", category: "Románticos", emoji: "💌", title: "Una carta escrita especialmente para ti" },
  { id: "playlist", category: "Románticos", emoji: "🎵", title: "Una playlist nueva hecha por mí" },
  { id: "foto", category: "Románticos", emoji: "📸", title: "Una foto exclusiva para ti" },
  { id: "dormir", category: "Románticos", emoji: "💤", title: "Vale por dormir juntos en llamada" },
  { id: "atencion", category: "Románticos", emoji: "💕", title: "30 minutos de atención 100% para ti" },
  { id: "escuchar", category: "Románticos", emoji: "🗣️", title: "Tú eliges el tema y yo escucho" },
  { id: "mensaje", category: "Románticos", emoji: "🥺", title: "Un mensaje largo diciéndote todo lo que amo de ti" },
  { id: "juego", category: "Para hacer cosas juntos", emoji: "🎮", title: "Tú eliges el juego" },
  { id: "pelicula", category: "Para hacer cosas juntos", emoji: "🎬", title: "Tú eliges la película" },
  { id: "noche-peli", category: "Para hacer cosas juntos", emoji: "🍿", title: "Noche de película obligatoria" },
  { id: "musica", category: "Para hacer cosas juntos", emoji: "🎵", title: "Sesión de escuchar música juntos" },
  { id: "cita-sorpresa", category: "Para hacer cosas juntos", emoji: "🎲", title: "Una cita virtual sorpresa" },
  { id: "roblox", category: "Para hacer cosas juntos", emoji: "🕹️", title: "Una hora extra de Roblox o tu juego favorito" },
  { id: "karaoke", category: "Para hacer cosas juntos", emoji: "🎤", title: "Karaoke juntos aunque cantemos horrible" },
  { id: "comida", category: "Para hacer cosas juntos", emoji: "🍕", title: "Comemos lo mismo en videollamada" },
  { id: "mandas", category: "Cupones de poder", emoji: "👑", title: "Hoy tú mandas" },
  { id: "discusion", category: "Cupones de poder", emoji: "😤", title: "Puedes ganar una discusión pequeña" },
  { id: "te-dije", category: "Cupones de poder", emoji: "🙄", title: "Un “te lo dije” sin consecuencias" },
  { id: "honestidad", category: "Cupones de poder", emoji: "🤨", title: "Puedes hacerme una pregunta y tengo que responder honestamente" },
  { id: "perfil", category: "Cupones de poder", emoji: "📱", title: "Puedes pedirme que cambie mi foto de perfil por una que tú elijas durante un día" },
  { id: "reto", category: "Cupones de poder", emoji: "😈", title: "Un reto para mí" },
  { id: "apodo", category: "Cupones de poder", emoji: "🗣️", title: "Puedes escoger un apodo nuevo para mí por 24 horas" },
  { id: "emoji", category: "Cupones de poder", emoji: "💬", title: "Puedes obligarme a usar tu emoji favorito todo el día" },
  { id: "carino", category: "Cupones especiales", emoji: "🥺", title: "Cupón “Necesito cariño” — aparezco y te doy atención" },
  { id: "dia-horrible", category: "Cupones especiales", emoji: "😭", title: "Cupón “Tuve un día horrible” — llamada, escucha y mimos virtuales" },
  { id: "quedate", category: "Cupones especiales", emoji: "💤", title: "Cupón “Quédate conmigo” — nos quedamos en llamada aunque no hagamos nada" },
  {
    id: "extrano",
    category: "Cupones especiales",
    emoji: "🫠",
    title: "Cupón “Extraño a mi novio” — recibes una dosis inmediata de amor",
    redeemed: true,
  },
  { id: "emergencia", category: "Cupones especiales", emoji: "❤️", title: "Cupón “Emergencia romántica” — te preparo algo sorpresa" },
  { id: "cita-legendaria", category: "Cupones legendarios", emoji: "💖", title: "Una cita virtual planeada completamente por mí" },
  { id: "cita-real", category: "Cupones legendarios", emoji: "✈️", title: "Canjeable por una cita real cuando por fin estemos juntos" },
  { id: "todo", category: "Cupones legendarios", emoji: "👑", title: "Hoy puedes decidir absolutamente todo lo que hacemos" },
  { id: "secreta", category: "Cupones legendarios", emoji: "💌", title: "Una sorpresa secreta hecha especialmente para ti" },
  { id: "consentida", category: "Cupones legendarios", emoji: "🌹", title: "Un día entero siendo consentida por mí a distancia" },
];

const CATEGORIES = [...new Set(COUPONS.map((coupon) => coupon.category))];
const AVAILABLE_COUPONS = COUPONS.filter((coupon) => !coupon.redeemed);
const SEGMENT_ANGLE = 360 / AVAILABLE_COUPONS.length;
const WHEEL_GRADIENT = `conic-gradient(${AVAILABLE_COUPONS.map((_, index) => {
  const start = index * SEGMENT_ANGLE;
  const end = (index + 1) * SEGMENT_ANGLE;
  return `${WHEEL_COLORS[index % WHEEL_COLORS.length]} ${start}deg ${end}deg`;
}).join(", ")})`;

/** Ruleta de cupones románticos con estética de circo digital. */
export default function CouponsRoulette() {
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState<Coupon | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const selectedNumber = selected
    ? String(COUPONS.findIndex((coupon) => coupon.id === selected.id) + 1).padStart(2, "0")
    : "";
  const whatsappMessage = selected
    ? `🎟️ CUPÓN #${selectedNumber} para Hannia\n\n${selected.emoji} ${selected.title}\nCategoría: ${selected.category}\n\nCanjeable cuando tú quieras 💕\n\n— César ✍️`
    : "";

  function spinWheel() {
    if (isSpinning) return;

    const nextIndex = Math.floor(Math.random() * AVAILABLE_COUPONS.length);
    const currentRotation = ((rotation % 360) + 360) % 360;
    const selectedCenterAngle = nextIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const desiredRotation = (360 - selectedCenterAngle) % 360;
    const correction = (desiredRotation - currentRotation + 360) % 360;
    const targetRotation = rotation + 360 * 6 + correction;

    setPendingIndex(nextIndex);
    setIsSpinning(true);
    setRotation(targetRotation);
  }

  function finishSpin() {
    if (!isSpinning || pendingIndex === null) return;
    setSelected(AVAILABLE_COUPONS[pendingIndex]);
    setPendingIndex(null);
    setIsSpinning(false);
  }

  return (
    <div>
      <SectionHeading
        emoji="🎪"
        title="La ruleta del Circo Digital"
        subtitle="Gira, deja que el caos decida y canjea tu premio, wapa"
      />

      <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-[#ffd21f] bg-[#17102f] p-4 shadow-2xl shadow-[#ff2f7d]/30 sm:p-8">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 flex justify-around text-2xl opacity-80">
          {Array.from({ length: 9 }, (_, index) => <span key={index}>✦</span>)}
        </div>
        <div aria-hidden="true" className="absolute -top-24 -left-20 size-64 rounded-full bg-[#b69cff]/20 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-20 -bottom-24 size-64 rounded-full bg-[#70e1d1]/15 blur-3xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#ffd166] uppercase">TAQUILLA DE PREMIOS</p>
            <p className="mt-1 text-sm text-cream/70">{AVAILABLE_COUPONS.length} cupones disponibles · {COUPONS.length - AVAILABLE_COUPONS.length} ya redimido 🎟️</p>
          </div>
          <span className="rounded-full bg-[#ff2f7d]/25 px-3 py-1.5 text-xs font-bold text-[#ffd21f]">NO HAY DEVOLUCIONES 🎟️</span>
        </div>

        <div className="relative mx-auto mt-8 size-72 sm:size-96">
          <span aria-hidden="true" className="absolute -top-7 left-1/2 z-20 -translate-x-1/2 text-4xl text-[#ffd21f] drop-shadow-lg">▼</span>
          <motion.div
            className="absolute inset-0 rounded-full border-8 border-[#ffd21f] p-2 shadow-2xl shadow-[#ff2f7d]/40"
            style={{ background: WHEEL_GRADIENT }}
            animate={{ rotate: rotation }}
            transition={{ duration: 4.8, ease: [0.12, 0.8, 0.2, 1] }}
            onAnimationComplete={finishSpin}
          >
            <div className="flex size-full items-center justify-center rounded-full border-4 border-[#201c3f]/80 bg-[#201c3f]/15">
              <div className="size-20 rounded-full border-4 border-[#ffd21f] bg-[#17102f] shadow-xl sm:size-24" />
            </div>
          </motion.div>
          <button
            type="button"
            onClick={spinWheel}
            disabled={isSpinning}
            className="absolute top-1/2 left-1/2 z-10 size-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-4 border-[#ffd21f] bg-[#ff2f7d] text-sm font-black tracking-widest text-white shadow-xl shadow-[#ff2f7d]/50 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 sm:size-28"
          >
            {isSpinning ? "GIRANDO" : "GIRAR"}
          </button>
        </div>

        <div className="relative mx-auto mt-8 max-w-xl text-center">
          {selected ? (
            <div className="relative rotate-[-1deg] overflow-hidden border-2 border-dashed border-[#ff2f7d] bg-[#fff3c4] px-6 py-5 text-[#25143d] shadow-xl shadow-black/30 sm:px-8 sm:py-6">
              <span aria-hidden="true" className="absolute -top-3 left-1/2 size-6 -translate-x-1/2 rounded-full bg-[#17102f]" />
              <span aria-hidden="true" className="absolute -bottom-3 left-1/2 size-6 -translate-x-1/2 rounded-full bg-[#17102f]" />
              <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-[#ff2f7d]/40 pb-3 text-xs font-black tracking-[0.2em] uppercase">
                <span>Ticket de Hannia</span>
                <span>#{selectedNumber}</span>
              </div>
              <p className="mt-4 text-5xl">{selected.emoji}</p>
              <p className="mt-3 text-xs font-black tracking-[0.2em] text-[#ff2f7d] uppercase">{selected.category}</p>
              <p className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">{selected.title}</p>
              <div className="mt-5 flex items-end justify-between gap-3 border-t-2 border-dashed border-[#ff2f7d]/40 pt-3 text-left">
                <span className="text-xs font-bold uppercase">Canjeable cuando tú quieras 💕</span>
                <span className="font-display -rotate-6 text-lg font-bold text-[#ff2f7d]">César ✍️</span>
              </div>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#25D366] bg-[#eafff0] px-4 py-3 text-sm font-black text-[#168a42] shadow-sm transition-colors hover:bg-[#d6ffe4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a42]"
                aria-label={`Compartir el cupón número ${selectedNumber} por WhatsApp`}
              >
                <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-[#25D366] text-base text-white">
                  💬
                </span>
                <span>Compartir por WhatsApp</span>
              </a>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/15 bg-black/20 p-5 text-cream">
              <p className="text-cream/75">Presiona GIRAR y descubre qué ticket te toca, wapa ✨</p>
            </div>
          )}
        </div>

        <details className="relative mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-cream">
          <summary className="cursor-pointer text-center text-sm font-bold text-[#ffd21f]">Ver todos los cupones ({COUPONS.length})</summary>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {CATEGORIES.map((category) => (
              <div key={category} className="rounded-2xl bg-black/15 p-3">
                <p className="mb-2 text-xs font-bold tracking-wide text-[#70e1d1] uppercase">{category}</p>
                <ul className="space-y-1.5 text-sm text-cream/75">
                  {COUPONS.filter((coupon) => coupon.category === category).map((coupon) => (
                    <li
                      key={coupon.id}
                      className={coupon.redeemed ? "text-cream/40 line-through decoration-2 decoration-[#ff2f7d]" : ""}
                    >
                      {coupon.emoji} {coupon.title}{coupon.redeemed ? " · REDIMIDO" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}
