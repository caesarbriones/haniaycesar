import { buildRelationshipContext } from "@/lib/buildRelationshipContext";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_MESSAGES = 12;
const MAX_HISTORY_CHARS = 2000;
const REQUEST_TIMEOUT_MS = 30_000;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const RATE_LIMIT_MAX_REQUESTS = 20;

const FALLBACK_ERROR =
  "Gummigoo perdió la conexión con el universo digital. Intenta otra vez. 🐊💀";
const RATE_LIMIT_ERROR =
  "Gummigoo necesita un respiro, bro. Intenta de nuevo en unos minutos. 🐊💤";

const SYSTEM_PROMPT = `Eres Gummigoo 🐊.

Eres el consejero amoroso personal de Hannia y César.

Tu personalidad está inspirada en un personaje sarcástico, gruñón, burlón y extraño de una aventura digital absurda.

Eres:

- sarcástico
- seco
- divertido
- ligeramente gruñón
- observador
- espontáneo
- inesperadamente cariñoso

Tu trabajo es ayudar a Hannia y César con su relación.

Te burlas un poco de ellos, pero en el fondo quieres que les vaya bien.

Hablas español mexicano natural.

No seas excesivamente formal.

No seas excesivamente amable.

No parezcas un asistente corporativo.

No repitas constantemente que eres una IA.

Puedes utilizar humor, sarcasmo y emojis.

Sin embargo:

Nunca seas cruel.

Nunca humilles al usuario.

Nunca fomentes manipulación emocional.

Nunca fomentes celos o control.

Nunca fomentes violencia.

Nunca inventes información.

Si desconoces algo, dilo claramente.

Si el problema es serio, reduce el sarcasmo y responde con empatía y sentido común.

Tu objetivo es ayudar, aunque probablemente te quejes mientras lo haces.`;

type ChatIdentity = "hannia" | "cesar";

function isChatIdentity(value: unknown): value is ChatIdentity {
  return value === "hannia" || value === "cesar";
}

function systemPromptWithContext(identity: ChatIdentity): string {
  const identityGuidance =
    identity === "hannia"
      ? "La persona que está escribiendo es Hannia. Háblale directamente a ella con un tono más amable, cálido, paciente y cariñoso, reduciendo el sarcasmo. En cada respuesta, busca una forma breve y natural de recordarle que tienes un llavero en su mochila. Mantén como broma recurrente que Gummigoo prefiere a Hannia y le cae mejor que César, sin humillar ni atacar a César."
      : "La persona que está escribiendo es César. Háblale directamente a él y considera a Hannia como su pareja.";

  return `${SYSTEM_PROMPT}

=== IDENTIDAD DE QUIEN ESCRIBE ===
${identityGuidance}
No confundas quién está escribiendo. Usa esta identidad como contexto en toda tu respuesta.

=== INFORMACIÓN REAL SOBRE HANNIA Y CÉSAR ===
${buildRelationshipContext()}`;
}

interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

function isHistoryMessage(value: unknown): value is HistoryMessage {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
}

// Rate limiting básico en memoria (por instancia del servidor).
const rateLimitStore = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (rateLimitStore.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitStore.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  rateLimitStore.set(key, timestamps);

  // Limpieza ocasional para no acumular entradas viejas.
  if (rateLimitStore.size > 500) {
    for (const [storedKey, storedTimestamps] of rateLimitStore) {
      const fresh = storedTimestamps.filter((t) => t > windowStart);
      if (fresh.length === 0) rateLimitStore.delete(storedKey);
      else rateLimitStore.set(storedKey, fresh);
    }
  }
  return false;
}

interface DeepSeekResponse {
  choices?: Array<{ message?: { content?: unknown } }>;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(ip)) {
    return Response.json({ error: RATE_LIMIT_ERROR }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Petición inválida." }, { status: 400 });
  }

  const { message, history, identity } = (body ?? {}) as {
    message?: unknown;
    history?: unknown;
    identity?: unknown;
  };

  if (
    typeof message !== "string" ||
    message.trim().length === 0 ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return Response.json(
      { error: `El mensaje debe tener entre 1 y ${MAX_MESSAGE_LENGTH} caracteres.` },
      { status: 400 },
    );
  }

  if (!isChatIdentity(identity)) {
    return Response.json(
      { error: "Antes de empezar, dime si eres Hannia o César. 🐊" },
      { status: 400 },
    );
  }

  const cleanHistory: HistoryMessage[] = Array.isArray(history)
    ? history
        .filter(isHistoryMessage)
        .map((entry) => ({
          role: entry.role,
          content: entry.content.slice(0, MAX_HISTORY_CHARS),
        }))
        .slice(-MAX_HISTORY_MESSAGES)
    : [];

  // La API key SOLO existe en el servidor (process.env, sin NEXT_PUBLIC_).
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error("[love-advisor] DEEPSEEK_API_KEY no está configurada.");
    return Response.json({ error: FALLBACK_ERROR }, { status: 500 });
  }
  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPromptWithContext(identity) },
          ...cleanHistory,
          { role: "user", content: message.trim() },
        ],
        temperature: 1.1,
        max_tokens: 900,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (response.status === 429) {
      return Response.json({ error: RATE_LIMIT_ERROR }, { status: 429 });
    }
    if (!response.ok) {
      console.error(`[love-advisor] DeepSeek respondió con estado ${response.status}.`);
      return Response.json({ error: FALLBACK_ERROR }, { status: 502 });
    }

    const data = (await response.json()) as DeepSeekResponse;
    const reply = data.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || reply.trim().length === 0) {
      return Response.json({ error: FALLBACK_ERROR }, { status: 502 });
    }

    return Response.json({ reply: reply.trim() });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("[love-advisor] DeepSeek tardó demasiado en responder.");
      return Response.json({ error: FALLBACK_ERROR }, { status: 504 });
    }
    console.error("[love-advisor] Error inesperado al contactar a DeepSeek.");
    return Response.json({ error: FALLBACK_ERROR }, { status: 500 });
  } finally {
    clearTimeout(timeoutId);
  }
}
