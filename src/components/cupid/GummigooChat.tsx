"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "gummigoo";
  text: string;
}

const SUGGESTED_QUESTIONS = [
  "¿Qué le regalo? 🎁",
  "Quiero sorprenderla 👀",
  "Dame una idea de cita ❤️",
  "¿Qué hacemos para nuestro aniversario?",
  "Escríbeme algo bonito 💌",
  "Necesito consejo 😭",
];

const MAX_MESSAGE_LENGTH = 1000;
const HISTORY_LIMIT = 10;

type ChatIdentity = "hannia" | "cesar";

const IDENTITY_OPTIONS: Array<{ id: ChatIdentity; label: string; emoji: string }> = [
  { id: "hannia", label: "Soy Hannia", emoji: "🌺" },
  { id: "cesar", label: "Soy César", emoji: "♨️" },
];

const GREETINGS: Record<ChatIdentity, string> = {
  hannia:
    "Qué onda, Hannia. Soy Gummigoo 🐊, consejero amoroso certificado por absolutamente nadie. Por cierto, sigo cuidando mi reputación desde tu mochila 😌. Dime qué necesitas y vemos si puedo ayudarte. Probablemente pueda. Qué fastidio. 💚",
  cesar:
    "Qué onda, César. Soy Gummigoo 🐊, consejero amoroso certificado por absolutamente nadie. Dime qué necesitas con Hannia y vemos si puedo ayudarte. Probablemente pueda. Qué fastidio. 💚",
};

/** Chat con Gummigoo 🐊, el consejero amoroso del universo de Hannia y César. */
export default function GummigooChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [identity, setIdentity] = useState<ChatIdentity | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  function chooseIdentity(nextIdentity: ChatIdentity) {
    setIdentity(nextIdentity);
    setMessages([
      {
        id: `greeting-${nextIdentity}`,
        role: "gummigoo",
        text: GREETINGS[nextIdentity],
      },
    ]);
    setError(null);
  }

  // Scroll automático al último mensaje.
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  async function send(rawText: string) {
    const text = rawText.trim();
    if (!identity || !text || loading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      // Solo se envía el historial reciente para controlar tokens.
      const history = nextMessages.slice(-(HISTORY_LIMIT + 1), -1).map((message) => ({
        role: message.role === "user" ? ("user" as const) : ("assistant" as const),
        content: message.text,
      }));

      const response = await fetch("/api/love-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history, identity }),
      });
      const data = (await response.json().catch(() => null)) as {
        reply?: string;
        error?: string;
      } | null;

      if (!response.ok) {
        setError(data?.error ?? "Algo salió mal. Intenta otra vez. 🐊");
        return;
      }
      if (data?.reply) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "gummigoo", text: data.reply ?? "" },
        ]);
      } else {
        setError("Gummigoo se quedó sin palabras. Intenta otra vez. 🐊");
      }
    } catch {
      setError("Sin conexión con el universo digital. Revisa tu internet e intenta otra vez. 🐊");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Encabezado del personaje */}
      <header className="mb-8 text-center">
        <div
          aria-hidden="true"
          className="relative mx-auto flex size-16 items-center justify-center overflow-hidden rounded-full border-2 border-goo/60 bg-goo/15 text-4xl shadow-lg shadow-goo/20 ring-4 ring-goo/10"
        >
          <Image
            src="/gummigoo.jpeg"
            alt=""
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <h2 className="font-display mt-4 text-3xl font-bold text-cream sm:text-4xl">
          Gummigoo
        </h2>
        <p className="mt-2 text-cream/60">
          El consejero amoroso que probablemente no necesitabas.
        </p>
      </header>

      <div className="mb-6 rounded-3xl border border-goo/25 bg-white/5 p-4 text-center">
        {!identity ? (
          <>
            <p className="text-sm font-semibold text-cream/80">Antes de empezar, dime quién eres 👀</p>
            <p className="mt-1 text-sm text-cream/55">Así sé desde qué lado del amor darte consejo.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {IDENTITY_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => chooseIdentity(option.id)}
                  className="cursor-pointer rounded-full border border-goo/35 bg-goo/10 px-4 py-2 text-sm font-semibold text-cream transition-colors hover:border-goo/70 hover:bg-goo/20"
                >
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-cream/65">
            Hablando con <span className="font-bold text-goo">{identity === "hannia" ? "Hannia" : "César"}</span> 💚
            <button
              type="button"
              onClick={() => {
                setIdentity(null);
                setMessages([]);
                setInput("");
              }}
              className="ml-2 cursor-pointer text-cream/45 underline decoration-dotted underline-offset-4 transition-colors hover:text-cream"
            >
              Cambiar
            </button>
          </p>
        )}
      </div>

      <aside
        aria-labelledby="gummigoo-banner-title"
        className="relative mb-6 overflow-hidden rounded-3xl border border-goo/30 bg-gradient-to-br from-goo/15 via-white/5 to-rose/10 p-4 shadow-lg shadow-goo/10 sm:p-5"
      >
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-12 size-40 rounded-full bg-goo/15 blur-3xl"
        />
        <div className="relative">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.18em] text-rose uppercase">
              Su copiloto amoroso
            </p>
            <h3
              id="gummigoo-banner-title"
              className="mt-1 text-xl font-bold text-cream sm:text-2xl"
            >
              Gummigoo está para ustedes 💚
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/70 sm:text-base">
              Está aquí para echarles la mano con ideas, sorpresas y consejos
              para seguir celebrando lo bonito que tienen.
            </p>
          </div>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-2" aria-label="Lo que Gummigoo puede hacer">
          <span className="rounded-full border border-goo/25 bg-black/15 px-3 py-1.5 text-xs text-cream/80">
            💡 Ideas de citas y regalos
          </span>
          <span className="rounded-full border border-goo/25 bg-black/15 px-3 py-1.5 text-xs text-cream/80">
            💌 Mensajes bonitos
          </span>
          <span className="rounded-full border border-goo/25 bg-black/15 px-3 py-1.5 text-xs text-cream/80">
            🫶 Consejos para ustedes
          </span>
        </div>
      </aside>

      {/* Preguntas sugeridas */}
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {SUGGESTED_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => send(question)}
            disabled={!identity || loading}
            className="cursor-pointer rounded-full border border-goo/30 bg-white/5 px-4 py-2 text-sm text-cream/80 backdrop-blur-sm transition-colors hover:border-goo/60 hover:bg-goo/15 hover:text-cream disabled:cursor-not-allowed disabled:opacity-40"
          >
            {question}
          </button>
        ))}
      </div>

      {/* Ventana de chat */}
      <div className="rounded-3xl border border-goo/25 bg-white/5 p-3 shadow-2xl backdrop-blur-md sm:p-4">
        <div
          ref={scrollRef}
          aria-live="polite"
          className="flex h-[380px] flex-col gap-3 overflow-y-auto rounded-2xl bg-black/25 p-4"
        >
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-end gap-2 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {message.role === "gummigoo" && (
                <span
                  aria-hidden="true"
                  className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-goo/50 bg-goo/15 text-base shadow-sm shadow-goo/20"
                >
                  <Image
                    src="/gummigoo.jpeg"
                    alt=""
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </span>
              )}
              <p
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line sm:text-base ${
                  message.role === "user"
                    ? "rounded-br-sm bg-gradient-to-r from-rose to-rose-deep text-white"
                    : "rounded-bl-sm border border-white/10 bg-white/10 text-cream"
                }`}
              >
                {message.text}
              </p>
            </motion.div>
          ))}

          {/* Indicador de escritura */}
          <AnimatePresence>
            {loading && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <span
                  aria-hidden="true"
                  className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-goo/50 bg-goo/15 text-base shadow-sm shadow-goo/20"
                >
                  <Image
                    src="/gummigoo.jpeg"
                    alt=""
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </span>
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-white/10 bg-white/10 px-4 py-3">
                  <span className="text-sm text-cream/70">Gummigoo está pensando...</span>
                  <span className="flex gap-1" aria-hidden="true">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="size-1.5 animate-typing-dot rounded-full bg-goo"
                        style={{ animationDelay: `${dot * 0.2}s` }}
                      />
                    ))}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error */}
        {error && (
          <p role="alert" className="mt-3 rounded-xl bg-rose/15 px-4 py-2 text-sm text-blush">
            {error}
          </p>
        )}

        {/* Entrada */}
        <form
          className="mt-3 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
        >
          <label htmlFor="gummigoo-input" className="sr-only">
            Escríbele a Gummigoo
          </label>
          <input
            id="gummigoo-input"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder={identity ? "Pídele consejo a Gummigoo..." : "Primero dime quién eres..."}
            autoComplete="off"
            disabled={!identity || loading}
            className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-cream placeholder:text-cream/40 focus:border-goo/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!identity || loading || !input.trim()}
            aria-label="Enviar mensaje"
            className="cursor-pointer rounded-full bg-goo p-3.5 text-night transition-colors hover:bg-goo/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="size-5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
