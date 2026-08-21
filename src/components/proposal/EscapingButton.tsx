"use client";

import { motion } from "framer-motion";
import type { RefObject } from "react";
import type { ButtonPosition } from "@/hooks/useEscapingButton";

interface EscapingButtonProps {
  buttonRef: RefObject<HTMLButtonElement | null>;
  position: ButtonPosition | null;
  attempts: number;
  label: string;
  onTriggerEscape: (clientX: number, clientY: number) => void;
}

/**
 * El botón "NO": vive posicionado de forma absoluta dentro de su contenedor
 * y huye del cursor/dedo con un resorte rápido y rebote. Se encoge poco a
 * poco cada vez que escapa.
 */
export default function EscapingButton({
  buttonRef,
  position,
  attempts,
  label,
  onTriggerEscape,
}: EscapingButtonProps) {
  const shrinkScale = Math.max(1 - attempts * 0.03, 0.6);

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      aria-label={`No (botón rebelde, intentos de atraparlo: ${attempts})`}
      // En táctil: huir ANTES de que el dedo aterrice y cancelar el click.
      onPointerDown={(event) => {
        event.preventDefault();
        onTriggerEscape(event.clientX, event.clientY);
      }}
      className="absolute top-0 left-0 cursor-pointer touch-none rounded-full border-2 border-wine/15 bg-white/80 px-6 py-3 text-base font-semibold whitespace-nowrap text-wine shadow-md backdrop-blur-sm select-none"
      style={{ opacity: position ? 1 : 0 }}
      animate={
        position
          ? { x: position.x, y: position.y, rotate: position.rotate, scale: shrinkScale }
          : {}
      }
      transition={{ type: "spring", stiffness: 520, damping: 17, mass: 0.7 }}
    >
      {label}
    </motion.button>
  );
}
