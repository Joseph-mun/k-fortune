/**
 * K-Pop Star data for Star Match feature.
 * Uses only publicly available birth date information.
 * No photos or likeness-right-infringing content.
 * Stars are identified by stage names only, with zodiac/element descriptions.
 */

export interface CelebrityProfile {
  id: string;
  stageName: string;
  group: string;
  birthDate: string; // YYYY-MM-DD (public info)
  gender: "male" | "female";
  emoji: string; // abstract representation, not a likeness
}

export const KPOP_STARS: CelebrityProfile[] = [
  // Group A
  { id: "star-a1", stageName: "RM", group: "Beyond The Scene", birthDate: "1994-09-12", gender: "male", emoji: "🎤" },
  { id: "star-a2", stageName: "Jin", group: "Beyond The Scene", birthDate: "1992-12-04", gender: "male", emoji: "🌟" },
  { id: "star-a3", stageName: "Suga", group: "Beyond The Scene", birthDate: "1993-03-09", gender: "male", emoji: "🎹" },
  { id: "star-a4", stageName: "J-Hope", group: "Beyond The Scene", birthDate: "1994-02-18", gender: "male", emoji: "💃" },
  { id: "star-a5", stageName: "Jimin", group: "Beyond The Scene", birthDate: "1995-10-13", gender: "male", emoji: "🦋" },
  { id: "star-a6", stageName: "V", group: "Beyond The Scene", birthDate: "1995-12-30", gender: "male", emoji: "🎨" },
  { id: "star-a7", stageName: "Jungkook", group: "Beyond The Scene", birthDate: "1997-09-01", gender: "male", emoji: "🏋️" },

  // Group B - BLACKPINK
  { id: "star-b1", stageName: "Jisoo", group: "BLACKPINK", birthDate: "1995-01-03", gender: "female", emoji: "🌹" },
  { id: "star-b2", stageName: "Jennie", group: "BLACKPINK", birthDate: "1996-01-16", gender: "female", emoji: "🐱" },
  { id: "star-b3", stageName: "Rose", group: "BLACKPINK", birthDate: "1997-02-11", gender: "female", emoji: "🎸" },
  { id: "star-b4", stageName: "Lisa", group: "BLACKPINK", birthDate: "1997-03-27", gender: "female", emoji: "💎" },

  // Group C - NewJeans
  { id: "star-c1", stageName: "Minji", group: "NewJeans", birthDate: "2004-05-07", gender: "female", emoji: "✨" },
  { id: "star-c2", stageName: "Hanni", group: "NewJeans", birthDate: "2004-10-06", gender: "female", emoji: "🐰" },
  { id: "star-c3", stageName: "Danielle", group: "NewJeans", birthDate: "2005-04-11", gender: "female", emoji: "🌙" },
  { id: "star-c4", stageName: "Haerin", group: "NewJeans", birthDate: "2006-05-15", gender: "female", emoji: "🐈" },
  { id: "star-c5", stageName: "Hyein", group: "NewJeans", birthDate: "2008-04-21", gender: "female", emoji: "🌸" },

  // Group D - Stray Kids
  { id: "star-d1", stageName: "Bang Chan", group: "Stray Kids", birthDate: "1997-10-03", gender: "male", emoji: "🐺" },
  { id: "star-d2", stageName: "Felix", group: "Stray Kids", birthDate: "2000-09-15", gender: "male", emoji: "☀️" },
  { id: "star-d3", stageName: "Hyunjin", group: "Stray Kids", birthDate: "2000-03-20", gender: "male", emoji: "🎭" },

  // Group E - aespa
  { id: "star-e1", stageName: "Karina", group: "aespa", birthDate: "2000-04-11", gender: "female", emoji: "🌊" },
  { id: "star-e2", stageName: "Winter", group: "aespa", birthDate: "2001-01-01", gender: "female", emoji: "❄️" },
  { id: "star-e3", stageName: "NingNing", group: "aespa", birthDate: "2002-10-23", gender: "female", emoji: "🎵" },

  // Group F - SEVENTEEN
  { id: "star-f1", stageName: "S.Coups", group: "SEVENTEEN", birthDate: "1995-08-08", gender: "male", emoji: "👑" },
  { id: "star-f2", stageName: "Mingyu", group: "SEVENTEEN", birthDate: "1997-04-06", gender: "male", emoji: "🏔️" },
];

/** Get unique group names */
export function getGroups(): string[] {
  return [...new Set(KPOP_STARS.map((s) => s.group))];
}

/** Get stars by group */
export function getStarsByGroup(group: string): CelebrityProfile[] {
  return KPOP_STARS.filter((s) => s.group === group);
}

/** Get star by ID */
export function getStarById(id: string): CelebrityProfile | undefined {
  return KPOP_STARS.find((s) => s.id === id);
}
