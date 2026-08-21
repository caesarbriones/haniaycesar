"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Devuelve false durante SSR y la primera renderización del cliente,
 * y true después de hidratar. Ideal para valores que dependen de "ahora"
 * (fechas, contadores) sin provocar errores de hidratación.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
