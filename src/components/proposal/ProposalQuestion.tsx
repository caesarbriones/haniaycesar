"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { NO_BUTTON_LABELS } from "@/config/relationship";
import { useEscapingButton } from "@/hooks/useEscapingButton";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useMounted } from "@/hooks/useMounted";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import EscapingButton from "./EscapingButton";

interface ProposalQuestionProps {
  onYes: () => void;
}

interface HeartBurstItem {
  id: number;
  x: number;
  y: number;
}

function attemptsCaption(attempts: number): string | null {
  if (attempts >= 20) return "Rindo formalmente el botón de NO. Ya no existe. 😌";
  if (attempts >= 10) return "Ese botón tiene instinto de supervivencia 😂";
  if (attempts >= 5) return "Creo que el universo te está dando una señal ✨";
  if (attempts >= 1) return "Ups, parece que ese botón no funciona 👀";
  return null;
}

/** La gran pregunta, con el botón NO que huye y el botón SÍ que crece. */
export default function ProposalQuestion({ onYes }: ProposalQuestionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const yesRef = useRef<HTMLButtonElement | null>(null);
  const burstCounterRef = useRef(0);
  const [bursts, setBursts] = useState<HeartBurstItem[]>([]);

  const { buttonRef, position, attempts, triggerEscape } = useEscapingButton({
    containerRef,
    avoidRef: yesRef,
    onEscape: (center) => {
      burstCounterRef.current += 1;
      const id = burstCounterRef.current;
      setBursts((prev) => [...prev.slice(-7), { id, x: center.x, y: center.y }]);
    },
  });

  const noLabel =
    NO_BUTTON_LABELS.find((entry) => attempts >= entry.minAttempts)?.label ?? "No 😈";
  const yesScale = Math.min(1 + attempts * 0.07, 1.7);
  const caption = attemptsCaption(attempts);

  // Parallax suave de los corazones decorativos según el cursor.
  const mounted = useMounted();
  const reducedMotion = usePrefersReducedMotion();
  const { x: mouseX, y: mouseY } = useMousePosition();
  const parallaxActive = mounted && !reducedMotion && typeof window !== "undefined";
  const offsetX = parallaxActive ? (mouseX / window.innerWidth - 0.5) * 20 : 0;
  const offsetY = parallaxActive ? (mouseY / window.innerHeight - 0.5) * 14 : 0;

  return (
    <motion.section
      className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.45 } }}
      transition={{ duration: 0.5 }}
    >
      {/* Corazones decorativos con parallax */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute top-[14%] left-[12%] hidden text-5xl select-none sm:block"
        animate={{ x: offsetX, y: offsetY }}
        transition={{ type: "spring", stiffness: 40, damping: 14 }}
      >
        💗
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute right-[12%] bottom-[16%] hidden text-4xl select-none sm:block"
        animate={{ x: -offsetX * 1.4, y: -offsetY * 1.4 }}
        transition={{ type: "spring", stiffness: 40, damping: 14 }}
      >
        💘
      </motion.span>

      <motion.p
        className="text-2xl text-wine-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Bueno, después de conocernos en Roblox...
      </motion.p>

      <motion.p
        className="mt-3 max-w-md text-2xl text-wine-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        Creo que ya no quiero seguir haciéndola larga 😭
      </motion.p>

      <motion.h2
        className="font-display mt-8 max-w-2xl text-4xl font-bold text-wine sm:text-6xl"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.6, duration: 0.7, type: "spring", stiffness: 120 }}
      >
        ¿Quieres ser mi novia? ❤️
      </motion.h2>

      <motion.div
        ref={containerRef}
        className="relative mx-auto mt-8 h-72 w-full max-w-md sm:h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 0.5 }}
      >
        <div className="flex justify-center pt-6">
          <motion.button
            ref={yesRef}
            type="button"
            onClick={onYes}
            animate={{ scale: yesScale }}
            whileHover={{ scale: yesScale * 1.08 }}
            whileTap={{ scale: yesScale * 0.93 }}
            transition={{ type: "spring", stiffness: 260, damping: 15 }}
            className="cursor-pointer rounded-full bg-gradient-to-r from-rose to-rose-deep px-10 py-4 text-xl font-bold text-white shadow-xl shadow-rose/40"
          >
            SÍ 💕
          </motion.button>
        </div>

        <EscapingButton
          buttonRef={buttonRef}
          position={position}
          attempts={attempts}
          label={noLabel}
          onTriggerEscape={triggerEscape}
        />

        {/* Mini explosiones de corazón cada vez que el botón NO escapa */}
        {bursts.map((burst) => (
          <motion.span
            key={burst.id}
            aria-hidden="true"
            className="pointer-events-none absolute select-none"
            style={{ left: burst.x, top: burst.y, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 1, scale: 0.4, y: 0 }}
            animate={{ opacity: 0, scale: 1.5, y: -26 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onAnimationComplete={() =>
              setBursts((prev) => prev.filter((item) => item.id !== burst.id))
            }
          >
            💕
          </motion.span>
        ))}
      </motion.div>

      <div aria-live="polite" className="mt-2 min-h-8">
        {caption && (
          <motion.p
            key={caption}
            className="text-lg text-wine-soft"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {caption}
          </motion.p>
        )}
      </div>
    </motion.section>
  );
}
