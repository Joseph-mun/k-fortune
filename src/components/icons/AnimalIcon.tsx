import { cn } from "@/lib/utils";

interface AnimalIconProps {
  animal: string;
  size?: number;
  className?: string;
  alt?: string;
}

const ANIMAL_INITIALS: Record<string, string> = {
  rat: "R",
  ox: "O",
  tiger: "T",
  rabbit: "R",
  dragon: "D",
  snake: "S",
  horse: "H",
  goat: "G",
  monkey: "M",
  rooster: "R",
  dog: "D",
  pig: "P",
};

const ANIMAL_COLORS: Record<string, string> = {
  rat: "#6366F1",
  ox: "#78716C",
  tiger: "#F59E0B",
  rabbit: "#EC4899",
  dragon: "#8B5CF6",
  snake: "#22C55E",
  horse: "#F43F5E",
  goat: "#A8A29E",
  monkey: "#FBBF24",
  rooster: "#E4E4E7",
  dog: "#92400E",
  pig: "#F9A8D4",
};

const ANIMAL_NAMES: Record<string, string> = {
  rat: "Rat",
  ox: "Ox",
  tiger: "Tiger",
  rabbit: "Rabbit",
  dragon: "Dragon",
  snake: "Snake",
  horse: "Horse",
  goat: "Goat",
  monkey: "Monkey",
  rooster: "Rooster",
  dog: "Dog",
  pig: "Pig",
};

export function AnimalIcon({ animal, size = 24, className, alt }: AnimalIconProps) {
  const initial = ANIMAL_INITIALS[animal] ?? "?";
  const color = ANIMAL_COLORS[animal] ?? "#A1A1AA";
  const animalName = ANIMAL_NAMES[animal] ?? animal;
  const ariaLabel = alt || `${animalName} zodiac animal`;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full icon-3d shrink-0",
        className
      )}
      role="img"
      aria-label={ariaLabel}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}20, ${color}40)`,
        border: `1px solid ${color}30`,
      }}
    >
      <span
        style={{
          color,
          fontSize: size * 0.45,
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        {initial}
      </span>
    </div>
  );
}
