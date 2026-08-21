import { relationshipConfig } from "@/config/relationship";
import { formatDateEs, isValidDateString } from "./dateUtils";
import { haversineKm } from "./geoUtils";

/** true si el valor sigue siendo un placeholder tipo "[ALGO]" o está vacío. */
function isPlaceholder(value: string): boolean {
  return !value || value.includes("[") || value.includes("]");
}

/**
 * Convierte relationshipConfig en contexto de texto para Gummigoo.
 * SOLO incluye información real y configurada explícitamente:
 * los placeholders y fechas sin configurar se omiten para que
 * Gummigoo nunca invente datos sobre Hannia o César.
 */
export function buildRelationshipContext(): string {
  const config = relationshipConfig;
  const lines: string[] = [];

  lines.push(`Nombres: ${config.partnerName} (ella) y ${config.yourName} (él). Son novios.`);

  const { partnerCity, yourCity } = config.distance;
  const distanceKm = Math.round(haversineKm(yourCity, partnerCity));
  lines.push(
    `Orígenes: ${config.partnerName} es de ${partnerCity.name}, ${partnerCity.state}; ` +
      `${config.yourName} es de ${yourCity.name}, ${yourCity.state}. ` +
      `Están a ~${distanceKm.toLocaleString("es-MX")} km de distancia en línea recta (relación a distancia).`,
  );

  const dateEntries: Array<[string, string]> = [
    ["Inicio de la relación", config.relationshipStartDate],
    ["Fecha de aniversario", config.anniversaryDate],
    [`Cumpleaños de ${config.partnerName}`, config.partnerBirthday],
    [`Cumpleaños de ${config.yourName}`, config.yourBirthday],
    [`Inicio de la carrera de ${config.partnerName}`, config.careerStartDate],
    [`Graduación de ${config.partnerName}`, config.graduationDate],
  ];
  const validDates = dateEntries.filter(([, value]) => isValidDateString(value));
  if (validDates.length > 0) {
    lines.push("", "Fechas importantes:");
    for (const [label, value] of validDates) {
      lines.push(`- ${label}: ${formatDateEs(value)}`);
    }
  }

  const partnerFacts = config.partnerFacts.filter((fact) => !isPlaceholder(fact.value));
  if (partnerFacts.length > 0) {
    lines.push("", `Datos sobre ${config.partnerName}:`);
    for (const fact of partnerFacts) {
      lines.push(`- ${fact.label}: ${fact.value}`);
    }
  }

  const yourFacts = config.yourFacts.filter((fact) => !isPlaceholder(fact.value));
  if (yourFacts.length > 0) {
    lines.push("", `Datos sobre ${config.yourName}:`);
    for (const fact of yourFacts) {
      lines.push(`- ${fact.label}: ${fact.value}`);
    }
  }

  const moments = config.timeline.filter((moment) => isValidDateString(moment.date));
  if (moments.length > 0) {
    lines.push("", "Momentos importantes de su historia:");
    for (const moment of moments) {
      lines.push(`- ${formatDateEs(moment.date)}: ${moment.title} — ${moment.description}`);
    }
  }

  const statEntries: Array<[string, number]> = [
    ["Mensajes", config.stats.messages],
    ["Risas", config.stats.laughs],
    ["Noches hablando", config.stats.lateNightTalks],
    ["Comidas juntos", config.stats.meals],
    ["Fotos", config.stats.photos],
    ["Canciones compartidas", config.stats.songs],
    ["Cafés juntos", config.stats.coffees],
    ["Citas", config.stats.dates],
  ];
  const realStats = statEntries.filter(([, value]) => value > 0);
  if (realStats.length > 0) {
    lines.push("", "Estadísticas de la relación (números reales configurados por ellos):");
    for (const [label, value] of realStats) {
      lines.push(`- ${label}: ${value}`);
    }
  }

  lines.push(
    "",
    "REGLA DE ORO: si un dato NO aparece en esta lista, NO lo conoces. " +
      "Dilo con tu estilo (por ejemplo: «No tengo ese dato, bro. Agrégalo a nuestra configuración y luego hablamos. 🐊»). " +
      "NUNCA inventes gustos, fechas, recuerdos ni detalles sobre Hannia o César.",
  );

  return lines.join("\n");
}
