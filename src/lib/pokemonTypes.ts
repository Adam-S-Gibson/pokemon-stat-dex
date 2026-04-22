export const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400 text-white",
  fire: "bg-orange-500 text-white",
  water: "bg-blue-500 text-white",
  electric: "bg-yellow-400 text-slate-900",
  grass: "bg-green-500 text-white",
  ice: "bg-cyan-300 text-slate-900",
  fighting: "bg-red-700 text-white",
  poison: "bg-purple-600 text-white",
  ground: "bg-amber-600 text-white",
  flying: "bg-indigo-300 text-slate-900",
  psychic: "bg-pink-500 text-white",
  bug: "bg-lime-500 text-white",
  rock: "bg-yellow-700 text-white",
  ghost: "bg-indigo-700 text-white",
  dragon: "bg-indigo-500 text-white",
  dark: "bg-gray-800 text-white",
  steel: "bg-slate-400 text-white",
  fairy: "bg-pink-300 text-slate-900",
};

export const typeColorClasses = (typeName: string): string =>
  TYPE_COLORS[typeName] ??
  "bg-[var(--color-gb-screen-light)] text-[var(--color-gb-ink)]";
