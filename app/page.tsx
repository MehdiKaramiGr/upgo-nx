"use client";

import { GithubBadge } from "@/components/HomePage/GithubBadge";
import { HeroSection } from "@/components/HomePage/HeroSection";
import { TechStack } from "@/components/HomePage/TechStack";
import { Features } from "@/components/HomePage/Features";
import { PreviewImage } from "@/components/HomePage/PreviewImage";
import { useEffect, useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <div className="relative isolate overflow-hidden bg-white dark:bg-[#020617] px-6  sm:py-12 lg:px-0">
      <GithubBadge />{" "}
      <div
        className="absolute inset-0 -z-10 overflow-hidden bg-white dark:bg-[#020617]"
        style={{
          backgroundImage: `
        linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
        radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
      `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-start lg:gap-y-13 lg:px-8 ">
        <div className="lg:col-span-1">
          <div className="lg:max-w-lg">
            <HeroSection />
            <p className="mt-6 text-xl/8 text-gray-700 dark:text-gray-300">
              A comprehensive platform for managing files with advanced access
              control, user and role management, and secure file sharing
              capabilities.
            </p>
          </div>
        </div>
        <PreviewImage />
        <TechStack />
        <Features isVisible={isVisible} />
      </div>
    </div>
  );
}
