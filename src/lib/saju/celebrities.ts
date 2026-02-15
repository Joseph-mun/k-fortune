/**
 * Famous birthdate profiles for Star Match feature.
 * Uses only publicly available birth date information.
 * No names, photos, or likeness-right-infringing content.
 * Profiles are categorized by Five Elements (오행) for discovery.
 */

export interface StarProfile {
  id: string;
  birthDate: string; // YYYY-MM-DD (public info)
  gender: "male" | "female";
  emoji: string; // abstract representation
  element: "wood" | "fire" | "earth" | "metal" | "water";
}

/**
 * Profiles derived from publicly known birth dates.
 * Grouped by dominant Five Element for intuitive browsing.
 */
export const STAR_PROFILES: StarProfile[] = [
  // Wood (목) — growth, creativity, leadership
  { id: "star-a1", birthDate: "1994-09-12", gender: "male", emoji: "🎤", element: "wood" },
  { id: "star-a3", birthDate: "1993-03-09", gender: "male", emoji: "🎹", element: "wood" },
  { id: "star-c1", birthDate: "2004-05-07", gender: "female", emoji: "✨", element: "wood" },
  { id: "star-d1", birthDate: "1997-10-03", gender: "male", emoji: "🐺", element: "wood" },
  { id: "star-f1", birthDate: "1995-08-08", gender: "male", emoji: "👑", element: "wood" },

  // Fire (화) — passion, performance, charisma
  { id: "star-a4", birthDate: "1994-02-18", gender: "male", emoji: "💃", element: "fire" },
  { id: "star-a5", birthDate: "1995-10-13", gender: "male", emoji: "🦋", element: "fire" },
  { id: "star-b2", birthDate: "1996-01-16", gender: "female", emoji: "🐱", element: "fire" },
  { id: "star-c2", birthDate: "2004-10-06", gender: "female", emoji: "🐰", element: "fire" },
  { id: "star-e1", birthDate: "2000-04-11", gender: "female", emoji: "🌊", element: "fire" },

  // Earth (토) — stability, warmth, reliability
  { id: "star-a2", birthDate: "1992-12-04", gender: "male", emoji: "🌟", element: "earth" },
  { id: "star-b1", birthDate: "1995-01-03", gender: "female", emoji: "🌹", element: "earth" },
  { id: "star-c3", birthDate: "2005-04-11", gender: "female", emoji: "🌙", element: "earth" },
  { id: "star-d3", birthDate: "2000-03-20", gender: "male", emoji: "🎭", element: "earth" },
  { id: "star-f2", birthDate: "1997-04-06", gender: "male", emoji: "🏔️", element: "earth" },

  // Metal (금) — precision, style, determination
  { id: "star-a6", birthDate: "1995-12-30", gender: "male", emoji: "🎨", element: "metal" },
  { id: "star-b3", birthDate: "1997-02-11", gender: "female", emoji: "🎸", element: "metal" },
  { id: "star-c4", birthDate: "2006-05-15", gender: "female", emoji: "🐈", element: "metal" },
  { id: "star-e2", birthDate: "2001-01-01", gender: "female", emoji: "❄️", element: "metal" },

  // Water (수) — adaptability, intuition, flow
  { id: "star-a7", birthDate: "1997-09-01", gender: "male", emoji: "🏋️", element: "water" },
  { id: "star-b4", birthDate: "1997-03-27", gender: "female", emoji: "💎", element: "water" },
  { id: "star-c5", birthDate: "2008-04-21", gender: "female", emoji: "🌸", element: "water" },
  { id: "star-d2", birthDate: "2000-09-15", gender: "male", emoji: "☀️", element: "water" },
  { id: "star-e3", birthDate: "2002-10-23", gender: "female", emoji: "🎵", element: "water" },
];

/** Element categories for UI grouping */
export const ELEMENT_CATEGORIES = ["wood", "fire", "earth", "metal", "water"] as const;

/** Get stars by element */
export function getStarsByElement(element: string): StarProfile[] {
  return STAR_PROFILES.filter((s) => s.element === element);
}

/** Get star by ID */
export function getStarById(id: string): StarProfile | undefined {
  return STAR_PROFILES.find((s) => s.id === id);
}

/** Format birth date for display (year + month only) */
export function formatStarLabel(profile: StarProfile, locale: string): string {
  const date = new Date(profile.birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (locale === "ko") {
    return `${year}년 ${month}월생`;
  }
  if (locale === "es") {
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `Nacido en ${monthNames[month - 1]} ${year}`;
  }
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `Born ${monthNames[month - 1]} ${year}`;
}
