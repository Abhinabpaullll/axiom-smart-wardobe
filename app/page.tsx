"use client";

import HeroScrollExperience from "@/components/HeroScrollExperience";
import PhysicalSystemSection from "@/components/PhysicalSystemSection";
import DigitalInventorySection from "@/components/DigitalInventorySection";
import IntelligenceSection from "@/components/IntelligenceSection";
import ArchiveStorySection from "@/components/ArchiveStorySection";
import VirtualTryOnSection from "@/components/VirtualTryOnSection";
import FinalChamberCTA from "@/components/FinalChamberCTA";
import AxiomFooter from "@/components/AxiomFooter";

export default function HomePage() {
  return (
    <main className="relative flex flex-col min-h-screen bg-[#080808] text-[#F5F5F7] selection:bg-amber selection:text-black">
      {/* 1. CINEMATIC HERO — scroll-driven chamber opening */}
      <HeroScrollExperience />

      {/* 2. SECTION 01: THE PHYSICAL SYSTEM */}
      <PhysicalSystemSection />

      {/* 3. SECTION 02: THE DIGITAL INVENTORY */}
      <DigitalInventorySection />

      {/* 4. SECTION 03: THE INTELLIGENCE LAYER */}
      <IntelligenceSection />

      {/* 5. SECTION 04: THE SARTORIAL ARCHIVE */}
      <ArchiveStorySection />

      {/* 6. SECTION 05: VIRTUAL TRY-ON LAB */}
      <VirtualTryOnSection />

      {/* 7. SECTION 06: FINAL ENTER CHAMBER CTA */}
      <FinalChamberCTA />

      {/* 8. SECTION 07: MINIMAL INDUSTRIAL FOOTER */}
      <AxiomFooter />
    </main>
  );
}
