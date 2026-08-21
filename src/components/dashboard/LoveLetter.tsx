"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { relationshipConfig } from "@/config/relationship";
import SectionHeading from "./SectionHeading";

/** Carta romántica final, presentada como carta digital. Esconde un secreto. */
export default function LoveLetter() {
  const paragraphs = relationshipConfig.loveLetter.split(/\n\s*\n/);
  const [secretFound, setSecretFound] = useState(false);

  return (
    <div>
      <SectionHeading emoji="💌" title="Una última cosa..." />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-2xl -rotate-[0.5deg] rounded-2xl border border-rose/15 bg-[#fffdf7] p-7 shadow-xl shadow-rose/10 sm:p-10"
      >
        {/* Sello decorativo */}
        <div
          aria-hidden="true"
          className="absolute -top-4 right-8 flex size-12 rotate-6 items-center justify-center rounded-full bg-rose text-xl text-white shadow-md"
        >
          ❤️
        </div>

        <div className="font-display space-y-5 text-lg leading-relaxed text-wine">
          {paragraphs.map((paragraph, index) => {
            const isLast = index === paragraphs.length - 1;
            return (
              <p
                key={index}
                className={
                  isLast ? "pt-2 text-right font-semibold whitespace-pre-line" : undefined
                }
              >
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Easter egg: corazón escondido en la esquina */}
        <button
          type="button"
          onClick={() => setSecretFound(true)}
          aria-label="Corazón escondido"
          className="absolute bottom-3 left-3 cursor-pointer text-sm opacity-25 transition-opacity hover:opacity-90"
        >
          ❤️
        </button>

        <AnimatePresence>
          {secretFound && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-xl bg-blush/60 px-4 py-3 text-center font-semibold text-rose-deep"
              role="status"
            >
              Encontraste nuestro secreto 👀❤️
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
