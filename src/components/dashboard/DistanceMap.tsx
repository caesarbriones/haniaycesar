"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { relationshipConfig } from "@/config/relationship";
import { formatTravelTime, haversineKm } from "@/lib/geoUtils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import SectionHeading from "./SectionHeading";

/**
 * Proyección calibrada sobre la silueta de México (public/mexico.svg,
 * viewBox 1000×630): la x es lineal en longitud y la y es cuadrática
 * en latitud (proyección cónica aproximada). Calibrada con los puntos
 * de referencia geográfica incluidos en el propio SVG.
 */
function projectToMap(lat: number, lng: number): { x: number; y: number } {
  const viewBoxX = 28.707 * lng + 3443.49;
  const viewBoxY = -0.11908 * lat * lat - 25.853 * lat + 1002.3;
  return { x: viewBoxX / 10, y: viewBoxY / 6.3 }; // porcentajes
}

interface TravelMode {
  emoji: string;
  label: string;
  speedKmh: number | null; // null = tarjeta especial sin cálculo
  specialValue?: string;
}

const TRAVEL_MODES: TravelMode[] = [
  { emoji: "🐌", label: "Un caracol muy motivado", speedKmh: 0.048 },
  { emoji: "🚶", label: "Caminando sin parar", speedKmh: 5 },
  { emoji: "🚗", label: "En carro", speedKmh: 90 },
  { emoji: "🕊️", label: "Una paloma mensajera", speedKmh: 60 },
  { emoji: "✈️", label: "En avión", speedKmh: 800 },
  {
    emoji: "💌",
    label: "Un «te amo» por mensaje",
    speedKmh: null,
    specialValue: "0.03 segundos ❤️",
  },
];

/**
 * Mapa de México con las ciudades de cada quien, la distancia real
 * (haversine) y tiempos de viaje divertidos calculados automáticamente.
 */
export default function DistanceMap() {
  const { partnerCity, yourCity } = relationshipConfig.distance;
  const reducedMotion = usePrefersReducedMotion();

  const distanceKm = haversineKm(yourCity, partnerCity);

  const from = projectToMap(yourCity.lat, yourCity.lng);
  const to = projectToMap(partnerCity.lat, partnerCity.lng);
  const controlX = (from.x + to.x) / 2;
  const controlY = Math.min(from.y, to.y) - 18;
  const pathData = `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;

  const cities = [
    {
      point: from,
      city: yourCity,
      person: relationshipConfig.yourName,
      avatar: "/avatar/cesar.jpeg",
    },
    {
      point: to,
      city: partnerCity,
      person: relationshipConfig.partnerName,
      avatar: "/avatar/hannia.jpeg",
    },
  ];

  return (
    <div>
      <SectionHeading
        emoji="🗺️"
        title="El mapa de nuestro amor"
        subtitle={`De ${yourCity.state} a ${partnerCity.state}: el amor no conoce kilómetros`}
      />

      <div className="overflow-hidden rounded-3xl border border-rose/15 bg-white/70 shadow-sm backdrop-blur-sm">
        {/* Mapa (la silueta ocupa exactamente el ratio 1000×630 del SVG) */}
        <div
          className="relative aspect-[1000/630] w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(242, 84, 123, 0.12) 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* Silueta de México */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mexico.svg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            style={{ filter: "drop-shadow(0 6px 16px rgba(214, 51, 97, 0.15))" }}
          />

          {/* Ruta entre las dos ciudades */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              id="ruta-amor"
              d={pathData}
              fill="none"
              stroke="var(--color-rose)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray="0.1 6"
              vectorEffect="non-scaling-stroke"
              className="map-dash"
            />
            {/* Corazón viajero: compensamos el ancho para evitar que el emoji se estire */}
            {!reducedMotion && (
              <g>
                <animateMotion dur="7s" repeatCount="indefinite" rotate="0">
                  <mpath href="#ruta-amor" />
                </animateMotion>
                <text
                  fontSize={4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform="scale(0.63 1)"
                >
                  ❤️
                </text>
              </g>
            )}
          </svg>

          {/* Marcadores */}
          {cities.map(({ point, city, person, avatar }, index) => (
            <div
              key={city.name}
              className="absolute"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 14, delay: index * 0.25 }}
              >
                <span
                  className="relative flex size-9 animate-float-y items-center justify-center overflow-hidden rounded-full border-2 border-rose/30 bg-white shadow-lg shadow-rose/20 sm:size-11"
                  style={{ animationDelay: `${index * 0.9}s` }}
                >
                  <Image
                    src={avatar}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 36px, 44px"
                    className="object-cover"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap text-wine shadow-sm">
                  {person}
                </span>
                <span className="mt-0.5 text-[10px] font-medium whitespace-nowrap text-wine-soft">
                  {city.name}, {city.state}
                </span>
              </motion.div>
            </div>
          ))}

          <span className="absolute right-2 bottom-1 text-[9px] text-wine-soft/50">
            Mapa: simplemaps.com
          </span>
        </div>

        {/* Distancia total */}
        <div className="border-t border-rose/10 px-6 py-8 text-center">
          <p className="text-sm font-semibold tracking-[0.25em] text-rose uppercase">
            Distancia en línea recta
          </p>
          <p className="font-display mt-2 text-5xl font-bold text-wine sm:text-6xl">
            {Math.round(distanceKm).toLocaleString("es-MX")}
            <span className="text-2xl text-rose-deep"> km</span>
          </p>
          <p className="mt-2 text-wine-soft">
            que no significan absolutamente nada ❤️
          </p>
        </div>

        {/* Tiempos de viaje */}
        <div className="grid grid-cols-2 gap-3 px-5 pb-6 sm:grid-cols-3 sm:px-6">
          {TRAVEL_MODES.map((mode) => (
            <div
              key={mode.label}
              className="rounded-2xl bg-blush/40 p-4 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <span aria-hidden="true" className="text-3xl">
                {mode.emoji}
              </span>
              <p className="mt-1.5 text-[11px] font-semibold tracking-wide text-wine-soft uppercase">
                {mode.label}
              </p>
              <p className="font-display mt-1 text-lg font-bold text-rose-deep">
                {mode.speedKmh !== null
                  ? formatTravelTime(distanceKm / mode.speedKmh)
                  : mode.specialValue}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
