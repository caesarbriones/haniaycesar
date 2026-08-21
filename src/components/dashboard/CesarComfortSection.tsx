"use client";

import { useState } from "react";
import { relationshipConfig } from "@/config/relationship";
import SectionHeading from "./SectionHeading";

const INITIAL_MESSAGE = "Wooooooah — (léelo con acento yucateco)";

/** Frases de César para acompañar a Hannia en un día difícil. */
export default function CesarComfortSection() {
  const phrases = relationshipConfig.comfortMessages;
  const [message, setMessage] = useState<string | null>(null);
  const [lastIndex, setLastIndex] = useState(-1);

  function generateMessage() {
    let nextIndex = Math.floor(Math.random() * phrases.length);
    while (phrases.length > 1 && nextIndex === lastIndex) {
      nextIndex = Math.floor(Math.random() * phrases.length);
    }
    setLastIndex(nextIndex);
    setMessage(phrases[nextIndex]);
  }

  return (
    <div>
      <SectionHeading
        emoji="🫂"
        title="¿Te sientes triste, wapa?"
        subtitle="No lo estás; presiona el botón y te lo compruebo 💕"
      />
      <div className="mx-auto max-w-2xl rounded-3xl border border-rose/20 bg-white/70 p-6 text-center shadow-lg shadow-rose/10 backdrop-blur-sm sm:p-8">
        <p className="min-h-20 font-display text-2xl font-bold leading-relaxed text-wine sm:text-3xl" aria-live="polite">
          {message ?? INITIAL_MESSAGE}
        </p>
        <button
          type="button"
          onClick={generateMessage}
          className="mt-6 cursor-pointer rounded-full bg-gradient-to-r from-rose to-rose-deep px-6 py-3 text-base font-bold text-white shadow-lg shadow-rose/30 transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose/40 active:translate-y-0"
        >
          Compruébalo aquí, wapa 💕
        </button>
      </div>
    </div>
  );
}
