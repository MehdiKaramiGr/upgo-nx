"use client";

import CardSwap, { Card } from "@/components/ReactBits/CardSwap";

const cards: { title: string; description: string }[] = [
  { title: "Card 1", description: "Your content here" },
  { title: "Card 2", description: "Your content here" },
  { title: "Card 3", description: "Your content here" },
];

export function FeatureCards() {
  return (
    <section className="relative w-1/2 h-96 flex items-center justify-center">
      <CardSwap
        cardDistance={60}
        verticalDistance={100}
        delay={5000}
        pauseOnHover={false}>
        {cards.map((card) => (
          <Card key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </Card>
        ))}
      </CardSwap>
    </section>
  );
}
