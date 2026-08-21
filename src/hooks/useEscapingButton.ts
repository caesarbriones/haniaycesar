"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { NO_ESCAPE_DISTANCE } from "@/config/relationship";

const PADDING = 8;
const AVOID_MARGIN = 16;
const ESCAPE_THROTTLE_MS = 140;
const CANDIDATES = 14;

export interface ButtonPosition {
  x: number;
  y: number;
  rotate: number;
}

interface UseEscapingButtonOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  /** Botón que NO debe ser tapado por el botón que escapa (el botón SÍ). */
  avoidRef: RefObject<HTMLButtonElement | null>;
  /** Se llama cada vez que el botón escapa, con el centro (coords del contenedor). */
  onEscape?: (center: { x: number; y: number }) => void;
}

/**
 * Sistema de escape basado en distancia:
 * 1. Lee la posición del cursor/dedo.
 * 2. Lee la posición del botón.
 * 3. Si el cursor entra en NO_ESCAPE_DISTANCE, calcula una nueva posición:
 *    dirección opuesta al cursor + jitter, con aceleración según intentos.
 * 4. Mantiene al botón dentro del contenedor y lejos del botón SÍ.
 *
 * Funciona con mouse y con touch (Pointer Events). El botón se mide y
 * posiciona de forma absoluta dentro del contenedor tras el montaje.
 */
export function useEscapingButton({
  containerRef,
  avoidRef,
  onEscape,
}: UseEscapingButtonOptions) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState<ButtonPosition | null>(null);
  const [attempts, setAttempts] = useState(0);

  const positionRef = useRef<ButtonPosition | null>(null);
  const attemptsRef = useRef(0);
  const lastEscapeRef = useRef(0);
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  const clampToContainer = useCallback(
    (x: number, y: number, width: number, height: number) => {
      const container = containerRef.current;
      if (!container) return { x, y };
      const rect = container.getBoundingClientRect();
      return {
        x: Math.min(Math.max(x, PADDING), Math.max(PADDING, rect.width - width - PADDING)),
        y: Math.min(Math.max(y, PADDING), Math.max(PADDING, rect.height - height - PADDING)),
      };
    },
    [containerRef],
  );

  // Medición inicial: colocar el botón NO junto al botón SÍ.
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const container = containerRef.current;
      const yes = avoidRef.current;
      const btn = buttonRef.current;
      if (!container || !yes || !btn) return;
      const c = container.getBoundingClientRect();
      const y = yes.getBoundingClientRect();
      const b = btn.getBoundingClientRect();

      let x = y.right - c.left + 16;
      let yPos = y.top - c.top;
      if (x + b.width + PADDING > c.width) {
        // No cabe a la derecha: debajo del SÍ, centrado.
        x = y.left - c.left + y.width / 2 - b.width / 2;
        yPos = y.bottom - c.top + 16;
      }
      const clamped = clampToContainer(x, yPos, b.width, b.height);
      const initial: ButtonPosition = { ...clamped, rotate: 0 };
      positionRef.current = initial;
      setPosition(initial);
    });
    return () => cancelAnimationFrame(rafId);
  }, [containerRef, avoidRef, clampToContainer]);

  // Mantener el botón dentro del contenedor si cambia el tamaño de la ventana.
  useEffect(() => {
    const onResize = () => {
      const btn = buttonRef.current;
      const current = positionRef.current;
      if (!btn || !current) return;
      const clamped = clampToContainer(current.x, current.y, btn.offsetWidth, btn.offsetHeight);
      const next = { ...current, ...clamped };
      positionRef.current = next;
      setPosition(next);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clampToContainer]);

  const escape = useCallback(
    (clientX: number, clientY: number, force = false) => {
      const container = containerRef.current;
      const btn = buttonRef.current;
      if (!container || !btn) return;

      const now = performance.now();
      if (now - lastEscapeRef.current < ESCAPE_THROTTLE_MS) return;

      const c = container.getBoundingClientRect();
      const b = btn.getBoundingClientRect();
      const bw = b.width;
      const bh = b.height;
      const centerX = b.left - c.left + bw / 2;
      const centerY = b.top - c.top + bh / 2;
      const pointerX = clientX - c.left;
      const pointerY = clientY - c.top;

      if (!force && Math.hypot(centerX - pointerX, centerY - pointerY) > NO_ESCAPE_DISTANCE) {
        return;
      }
      lastEscapeRef.current = now;

      const maxX = Math.max(PADDING, c.width - bw - PADDING);
      const maxY = Math.max(PADDING, c.height - bh - PADDING);
      const avoid = avoidRef.current?.getBoundingClientRect() ?? null;
      const baseAngle = Math.atan2(centerY - pointerY, centerX - pointerX);
      const speedBoost = Math.min(attemptsRef.current * 8, 120);

      let best: { x: number; y: number } | null = null;
      let bestScore = -Infinity;
      for (let i = 0; i < CANDIDATES; i++) {
        const jitter = i === 0 ? 0.3 : Math.PI * 0.9;
        const angle = baseAngle + (Math.random() * 2 - 1) * jitter;
        const jump = 170 + Math.random() * 130 + speedBoost;
        const nx = Math.min(
          Math.max(centerX + Math.cos(angle) * jump - bw / 2, PADDING),
          maxX,
        );
        const ny = Math.min(
          Math.max(centerY + Math.sin(angle) * jump - bh / 2, PADDING),
          maxY,
        );
        const nCenterX = nx + bw / 2;
        const nCenterY = ny + bh / 2;
        const distanceToPointer = Math.hypot(nCenterX - pointerX, nCenterY - pointerY);
        const distanceTravelled = Math.hypot(nCenterX - centerX, nCenterY - centerY);

        let penalty = 0;
        if (avoid) {
          const ax1 = avoid.left - c.left - AVOID_MARGIN;
          const ay1 = avoid.top - c.top - AVOID_MARGIN;
          const ax2 = avoid.right - c.left + AVOID_MARGIN;
          const ay2 = avoid.bottom - c.top + AVOID_MARGIN;
          if (nx < ax2 && nx + bw > ax1 && ny < ay2 && ny + bh > ay1) penalty = 10_000;
        }

        const score = distanceToPointer + distanceTravelled * 0.3 - penalty;
        if (score > bestScore) {
          bestScore = score;
          best = { x: nx, y: ny };
        }
      }
      if (!best) return;

      const next: ButtonPosition = { ...best, rotate: Math.random() * 26 - 13 };
      positionRef.current = next;
      setPosition(next);
      attemptsRef.current += 1;
      setAttempts(attemptsRef.current);
      onEscapeRef.current?.({ x: best.x + bw / 2, y: best.y + bh / 2 });
    },
    [containerRef, avoidRef],
  );

  // Escape por proximidad (mouse y lápiz/dedo arrastrando).
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => escape(event.clientX, event.clientY);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [escape]);

  /** Para pointerdown táctil: huir antes de que el toque aterrice. */
  const triggerEscape = useCallback(
    (clientX: number, clientY: number) => escape(clientX, clientY, true),
    [escape],
  );

  return { buttonRef, position, attempts, triggerEscape };
}
