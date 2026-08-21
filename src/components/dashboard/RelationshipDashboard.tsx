"use client";

import { motion } from "framer-motion";
import { relationshipConfig } from "@/config/relationship";
import DashboardNav from "./DashboardNav";
import RelationshipHero from "./RelationshipHero";
import RelationshipStats from "./RelationshipStats";
import DistanceMap from "./DistanceMap";
import AnniversaryCounter from "./AnniversaryCounter";
import BirthdayCard from "./BirthdayCard";
import GraduationCard from "./GraduationCard";
import FactsSection from "./FactsSection";
import Timeline from "./Timeline";
import HanniaCollage from "./HanniaCollage";
import LoveLetter from "./LoveLetter";
import SectionHeading from "./SectionHeading";
import CesarComfortSection from "./CesarComfortSection";
import GummigooFab from "@/components/cupid/GummigooFab";
import GummigooChat from "@/components/cupid/GummigooChat";

/**
 * "Nuestro pequeño universo ❤️": diario digital, álbum de recuerdos,
 * línea de tiempo y espacio personal de la relación.
 */
export default function RelationshipDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-dvh bg-cream pb-28 md:pb-16"
    >
      <DashboardNav />
      <GummigooFab />
      <RelationshipHero />

      <main className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <section id="nosotros" className="scroll-mt-28 py-14">
          <RelationshipStats />
        </section>

        <section id="mapa" className="scroll-mt-28 py-14">
          <DistanceMap />
        </section>

        <section id="fechas" className="scroll-mt-28 py-14">
          <header className="mb-10 text-center">
            <span aria-hidden="true" className="text-4xl">
              📅
            </span>
            <h2 className="font-display mt-2 text-3xl font-bold text-wine sm:text-4xl">
              Fechas que importan
            </h2>
            <p className="mt-2 text-lg text-wine-soft">
              El universo ya hizo la cuenta regresiva por nosotros
            </p>
          </header>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
            <AnniversaryCounter />
            <BirthdayCard
              birthday={relationshipConfig.partnerBirthday}
              title="El cumpleaños de mi persona favorita 🎂"
            />
            <BirthdayCard
              birthday={relationshipConfig.yourBirthday}
              title={`El cumpleaños de ${relationshipConfig.yourName} 🎂`}
            />
            <GraduationCard />
          </div>
        </section>

        <section id="hannia" className="scroll-mt-28 py-14">
          <FactsSection
            emoji="👩"
            title={`Datos que debes saber de ${relationshipConfig.partnerName} 👀`}
            subtitle="Manual oficial de supervivencia"
            facts={relationshipConfig.partnerFacts}
          />
        </section>

        <section id="cesar" className="scroll-mt-28 py-14">
          <FactsSection
            emoji="👨"
            title="Ahora datos sobre mí 😌"
            subtitle="Para que quede constancia oficial"
            facts={relationshipConfig.yourFacts}
          />
        </section>

        <section id="historia" className="scroll-mt-28 py-14">
          <Timeline />
        </section>

        <section id="fotos" className="scroll-mt-28 py-14">
          <HanniaCollage />
        </section>

        <section id="carta" className="scroll-mt-28 py-14">
          <LoveLetter />
        </section>

        <section id="playlist" className="scroll-mt-28 py-14">
          <SectionHeading
            emoji="🎵"
            title="Nuestra playlist"
            subtitle="La banda sonora de todo lo que estamos empezando"
          />
          <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-rose/15 bg-[#191414] p-2 shadow-xl shadow-rose/10">
            <iframe
              title="Playlist de Hannia y César"
              src="https://open.spotify.com/embed/playlist/3Y1TfUcDvO0JGDY04uMEgN?utm_source=generator&theme=0"
              width="100%"
              height="352"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="block w-full rounded-2xl"
            />
          </div>
        </section>

        <section id="animo" className="scroll-mt-28 py-14">
          <CesarComfortSection />
        </section>

        <section id="gummigoo" className="scroll-mt-28 py-14">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-night px-4 py-12 sm:px-8">
            {/* Detalles verdes estilo Gummigoo */}
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 size-72 rounded-full bg-goo/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-24 size-72 rounded-full bg-rose/10 blur-3xl"
            />
            <GummigooChat />
          </div>
        </section>
      </main>

      <footer className="px-6 pb-6 text-center text-sm text-wine-soft">
        Hecho con ❤️ por {relationshipConfig.yourName} para {relationshipConfig.partnerName}
      </footer>
    </motion.div>
  );
}
