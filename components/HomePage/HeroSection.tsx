"use client";

import Button from "@/components/ui/button";
import BlurText from "@/components/ReactBits/BlurText";

const HERO_TITLE = "NxUpGo";
const HERO_SUBTITLE = "The Next Level of File Management";

export function HeroSection() {
  return (
    <section className="flex flex-col items-start gap-13">
      <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-primary-400">
        {HERO_TITLE}
      </h1>
      <BlurText
        text={HERO_SUBTITLE}
        delay={100}
        animateBy="letters"
        direction="bottom"
        className="text-2xl mb-8"
      />
      <div className="flex gap-4">
        <Button color="primary">Get Started</Button>
        <Button variant="solid">Learn More</Button>
      </div>
    </section>
  );
}
