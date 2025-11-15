"use client";

import { BackgroundPrism } from "@/components/HomePage/BackgroundPrism";
import { FeatureCards } from "@/components/HomePage/FeatureCards";
import { GithubBadge } from "@/components/HomePage/GithubBadge";
import { HeroSection } from "@/components/HomePage/HeroSection";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center h-[90vh] font-sans gap-12 relative overflow-hidden">
      <BackgroundPrism />
      <GithubBadge />
      <div className="flex w-[80%] justify-between px-20 py-12 rounded-lg">
        <HeroSection />
        <FeatureCards />
      </div>
    </main>
  );
}
