"use client";

import { Carousel } from "@/components/ui/Carousel";
import { TiltCard } from "@/components/ui/TiltCard";
import { MetaphorIcon } from "@/components/icons/MetaphorIcon";
import { ElementIcon } from "@/components/icons/ElementIcon";

const CARDS = [
  { metaphor: "great-tree" as const, name: "THE GREAT TREE", sub: "Yang Wood", size: 48 },
  { metaphor: "sun" as const, name: "THE SUN", sub: "Yang Fire", size: 56, featured: true },
  { metaphor: "ocean" as const, name: "THE OCEAN", sub: "Yang Water", size: 48 },
  { metaphor: "candle" as const, name: "THE CANDLE", sub: "Yin Fire", size: 48 },
  { metaphor: "jewel" as const, name: "THE JEWEL", sub: "Yin Metal", size: 48 },
] as const;

function CardItem({ metaphor, name, sub, size, featured }: typeof CARDS[number] & { featured?: boolean }) {
  return (
    <TiltCard
      className={`${
        featured
          ? "w-32 md:w-40 ring-glow-purple z-10"
          : "w-28 md:w-36 opacity-80 hover:opacity-100"
      } aspect-[2/3] rounded-lg glass-premium p-3 flex flex-col items-center justify-center text-center transition-all duration-500`}
      tiltMax={8}
    >
      <MetaphorIcon metaphor={metaphor} size={size} className="mb-2" />
      <span className="text-[10px] md:text-xs text-gold-400 font-semibold font-[family-name:var(--font-heading)]">
        {name}
      </span>
      <span className="text-[8px] md:text-[10px] text-text-muted mt-0.5">{sub}</span>
      {featured && (
        <div className="flex gap-0.5 mt-2">
          {(["wood", "fire", "earth", "metal", "water"] as const).map((el) => (
            <ElementIcon key={el} element={el} size={12} />
          ))}
        </div>
      )}
    </TiltCard>
  );
}

export function CardPreview() {
  // Mobile: Carousel
  const carouselItems = CARDS.map((card) => (
    <div key={card.name} className="flex justify-center py-4">
      <CardItem {...card} featured />
    </div>
  ));

  return (
    <>
      {/* Mobile — Carousel */}
      <div className="md:hidden mb-10">
        <Carousel items={carouselItems} showArrows={false} autoPlay autoPlayInterval={3000} />
      </div>

      {/* Desktop — Fan-out layout */}
      <div className="hidden md:block perspective-1000 mb-10">
        <div className="flex justify-center items-end gap-6">
          <div style={{ transform: "rotate(-6deg)" }}>
            <CardItem {...CARDS[0]} />
          </div>
          <CardItem {...CARDS[1]} featured />
          <div style={{ transform: "rotate(6deg)" }}>
            <CardItem {...CARDS[2]} />
          </div>
        </div>
      </div>
    </>
  );
}
