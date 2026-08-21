// Utilidades geográficas para "el mapa de nuestro amor".
// Todo se calcula a partir de las coordenadas reales en relationshipConfig.

export interface Coordinates {
  lat: number;
  lng: number;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Distancia en línea recta (km) entre dos puntos del planeta — fórmula haversine. */
export function haversineKm(a: Coordinates, b: Coordinates): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

/**
 * Convierte horas de viaje en un texto bonito:
 * "1.6 horas", "11 días", "3 años y 46 días", etc.
 */
export function formatTravelTime(hours: number): string {
  if (hours < 1) {
    return `${Math.max(1, Math.round(hours * 60))} minutos`;
  }
  if (hours < 48) {
    const rounded = Math.round(hours * 10) / 10;
    return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)} horas`;
  }
  const days = Math.round(hours / 24);
  if (days > 90 && days < 365 * 2) {
    return `${Math.round(days / 30.44)} meses`;
  }
  if (days >= 365 * 2) {
    const years = Math.floor(days / 365);
    const remainingDays = Math.round(days % 365);
    return remainingDays > 15
      ? `${years} años y ${remainingDays} días`
      : `${years} años`;
  }
  return `${days} días`;
}
