"use client";

import { useEffect, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Posición del cursor, actualizada vía requestAnimationFrame para no
 * saturar renders. Seguro en SSR (empieza en 0,0 y solo escucha en cliente).
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    let rafId = 0;
    let latest: MousePosition = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      latest = { x: event.clientX, y: event.clientY };
      if (rafId === 0) {
        rafId = requestAnimationFrame(() => {
          setPosition(latest);
          rafId = 0;
        });
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (rafId !== 0) cancelAnimationFrame(rafId);
    };
  }, []);

  return position;
}
