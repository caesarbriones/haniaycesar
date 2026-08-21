// Utilidades de fechas. Todas las funciones son seguras ante fechas
// placeholder ("YYYY-MM-DD"): devuelven null para que la UI muestre
// un mensaje bonito en lugar de romperse.

export interface RelationshipDuration {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isToday: boolean;
}

export interface GraduationProgress {
  percent: number; // 0 - 100
  daysRemaining: number;
  totalDays: number;
  daysDone: number;
  finished: boolean;
}

const PLACEHOLDER_PATTERN = /Y|M|D/;
/** Fechas sin año, útiles para cumpleaños: "MM-DD". */
const MONTH_DAY_PATTERN = /^\d{2}-\d{2}$/;

/** true si la cadena es una fecha real parseable ("YYYY-MM-DD" o "MM-DD") y no un placeholder. */
export function isValidDateString(value: string): boolean {
  if (!value || PLACEHOLDER_PATTERN.test(value)) return false;
  if (MONTH_DAY_PATTERN.test(value)) {
    const [m, d] = value.split("-").map(Number);
    return m >= 1 && m <= 12 && d >= 1 && d <= 31;
  }
  const d = new Date(`${value}T00:00:00`);
  return !Number.isNaN(d.getTime());
}

/** Parsea "YYYY-MM-DD" (o "MM-DD" con año genérico) como fecha LOCAL. */
export function parseDate(value: string): Date | null {
  if (!isValidDateString(value)) return null;
  if (MONTH_DAY_PATTERN.test(value)) {
    const [m, d] = value.split("-").map(Number);
    return new Date(2000, m - 1, d);
  }
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Calcula años, meses, días y total de días desde la fecha de inicio. */
export function calculateRelationshipDuration(
  startDate: string,
  now: Date = new Date(),
): RelationshipDuration | null {
  const start = parseDate(startDate);
  if (!start) return null;

  const from = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (to.getTime() < from.getTime()) {
    return { years: 0, months: 0, days: 0, totalDays: 0 };
  }

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = (to.getMonth() - 1 + 12) % 12;
    const prevYear = to.getMonth() === 0 ? to.getFullYear() - 1 : to.getFullYear();
    days += daysInMonth(prevYear, prevMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((to.getTime() - from.getTime()) / 86_400_000);
  return { years, months, days, totalDays };
}

/**
 * Próximo aniversario (mes/día de la fecha de inicio).
 * Si hoy ES el aniversario, devuelve hoy.
 */
export function getNextAnniversary(startDate: string, now: Date = new Date()): Date | null {
  const start = parseDate(startDate);
  if (!start) return null;
  const month = start.getMonth();
  const day = start.getDate();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let candidate = new Date(today.getFullYear(), month, day);
  if (candidate.getTime() < today.getTime()) {
    candidate = new Date(today.getFullYear() + 1, month, day);
  }
  return candidate;
}

/** Próximo cumpleaños. Si hoy ES el cumpleaños, devuelve hoy. */
export function getNextBirthday(birthday: string, now: Date = new Date()): Date | null {
  const date = parseDate(birthday);
  if (!date) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let candidate = new Date(today.getFullYear(), date.getMonth(), date.getDate());
  if (candidate.getTime() < today.getTime()) {
    candidate = new Date(today.getFullYear() + 1, date.getMonth(), date.getDate());
  }
  return candidate;
}

/** Partes de un countdown hasta una fecha objetivo. */
export function getCountdownParts(target: Date, now: Date = new Date()): CountdownParts {
  const totalMs = target.getTime() - now.getTime();
  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isToday: true };
  }
  const seconds = Math.floor(totalMs / 1000);
  return {
    days: Math.floor(seconds / 86_400),
    hours: Math.floor((seconds % 86_400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    totalMs,
    isToday: false,
  };
}

/** Días completos que faltan para una fecha (0 si es hoy). */
export function getDaysUntil(target: Date, now: Date = new Date()): number {
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

/** Progreso de la carrera entre careerStart y graduation. */
export function getGraduationProgress(
  careerStart: string,
  graduation: string,
  now: Date = new Date(),
): GraduationProgress | null {
  const start = parseDate(careerStart);
  const end = parseDate(graduation);
  if (!start || !end || end.getTime() <= start.getTime()) return null;

  const totalMs = end.getTime() - start.getTime();
  const doneMs = now.getTime() - start.getTime();
  const percent = Math.min(100, Math.max(0, (doneMs / totalMs) * 100));
  const totalDays = Math.round(totalMs / 86_400_000);
  const daysDone = Math.min(totalDays, Math.max(0, Math.floor(doneMs / 86_400_000)));

  return {
    percent,
    totalDays,
    daysDone,
    daysRemaining: getDaysUntil(end, now),
    finished: percent >= 100,
  };
}

/**
 * Formatea una fecha de forma bonita en español: "14 de febrero de 2026".
 * Las fechas "MM-DD" (sin año) se muestran como "14 de febrero".
 */
export function formatDateEs(value: string | Date | null): string {
  if (typeof value === "string" && MONTH_DAY_PATTERN.test(value) && isValidDateString(value)) {
    const date = parseDate(value);
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
    }).format(date!);
  }
  const date = typeof value === "string" ? parseDate(value) : value;
  if (!date) return "Próximamente ✨";
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
