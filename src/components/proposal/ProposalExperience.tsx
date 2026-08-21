"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import FloatingHearts from "@/components/effects/FloatingHearts";
import CursorTrail from "@/components/effects/CursorTrail";
import RelationshipDashboard from "@/components/dashboard/RelationshipDashboard";
import IntroScreen from "./IntroScreen";
import RomanticMessage from "./RomanticMessage";
import ProposalQuestion from "./ProposalQuestion";
import CelebrationScreen from "./CelebrationScreen";

type Stage = "intro" | "messages" | "question" | "celebration" | "universe";

/**
 * Orquesta la experiencia completa:
 * intro → mensajes románticos → propuesta → celebración → dashboard.
 */
export default function ProposalExperience() {
  const [stage, setStage] = useState<Stage>("intro");
  const inUniverse = stage === "universe";

  return (
    <main className="relative min-h-dvh">
      {!inUniverse && (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-0 -z-10 bg-gradient-to-b from-blush via-cream to-cream"
          />
          <FloatingHearts />
          <CursorTrail />
        </>
      )}

      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <IntroScreen
            key="intro"
            onContinue={() => setStage("messages")}
            onSkip={() => setStage("universe")}
          />
        )}
        {stage === "messages" && (
          <RomanticMessage key="messages" onContinue={() => setStage("question")} />
        )}
        {stage === "question" && (
          <ProposalQuestion key="question" onYes={() => setStage("celebration")} />
        )}
        {stage === "celebration" && (
          <CelebrationScreen key="celebration" onComplete={() => setStage("universe")} />
        )}
        {stage === "universe" && <RelationshipDashboard key="universe" />}
      </AnimatePresence>
    </main>
  );
}
