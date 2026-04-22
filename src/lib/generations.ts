const ROMAN_TO_NUMBER: Record<string, number> = {
  i: 1,
  ii: 2,
  iii: 3,
  iv: 4,
  v: 5,
  vi: 6,
  vii: 7,
  viii: 8,
  ix: 9,
};

export const ROMAN_NUMERALS = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
];

export const REGION_NAMES: Record<number, string> = {
  1: "Kanto",
  2: "Johto",
  3: "Hoenn",
  4: "Sinnoh",
  5: "Unova",
  6: "Kalos",
  7: "Alola",
  8: "Galar",
  9: "Paldea",
};

export const parseGenerationKey = (key: string): number => {
  const match = key.match(/generation-(\w+)$/);
  if (!match) return 0;
  return ROMAN_TO_NUMBER[match[1].toLowerCase()] ?? 0;
};

export const generationLabel = (num: number): string => {
  const roman = ROMAN_NUMERALS[num] ?? String(num);
  const region = REGION_NAMES[num];
  return region ? `Gen ${roman} · ${region}` : `Gen ${roman}`;
};
