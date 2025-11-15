"use client";

import Prism from "@/components/ReactBits/Prism";

export function BackgroundPrism() {
  return (
    <div className="absolute right-0 h-full w-screen pointer-events-none">
      <Prism
        animationType="rotate"
        timeScale={0.2}
        height={3.8}
        baseWidth={4.5}
        scale={3}
        hueShift={0}
        colorFrequency={1}
        noise={0.1}
        glow={1}
        transparent
      />
    </div>
  );
}
