/**
 * Generador pseudoaleatorio determinista (mulberry32).
 * Sirve para generar decoración "aleatoria" idéntica en SSR y cliente,
 * evitando errores de hidratación sin dejar de sentirse orgánico.
 */
export function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
