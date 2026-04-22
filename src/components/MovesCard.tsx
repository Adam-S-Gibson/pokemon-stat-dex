import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PokemonMove } from "@/types/pokemonDataTypes";
import { formatName } from "@/lib/utils";

interface MovesCardProps {
  moves: PokemonMove[];
}

interface GroupedMove {
  key: string;
  name: string;
  level: number;
  type: string;
  damageClass: string;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
}

const METHOD_LABELS: Record<string, string> = {
  "level-up": "Level Up",
  machine: "TM/HM",
  egg: "Egg",
  tutor: "Move Tutor",
};

const METHOD_ORDER = ["level-up", "machine", "egg", "tutor"];

const formatMethodLabel = (method: string): string =>
  METHOD_LABELS[method] ??
  method
    .split("-")
    .map((word) => formatName(word))
    .join(" ");

const formatMoveName = (name: string): string =>
  name
    .split("-")
    .map((word) => formatName(word))
    .join(" ");

const groupMoves = (
  moves: PokemonMove[],
): Record<string, GroupedMove[]> => {
  const byMethod: Record<string, Map<string, GroupedMove>> = {};

  for (const entry of moves) {
    const method = entry.moveLearnMethod.name;
    if (!byMethod[method]) byMethod[method] = new Map();
    const bucket = byMethod[method];
    const moveName = entry.move.name;
    const existing = bucket.get(moveName);

    if (!existing) {
      bucket.set(moveName, {
        key: `${method}-${moveName}`,
        name: moveName,
        level: entry.level,
        type: entry.move.moveType.name,
        damageClass: entry.move.damageClass?.name ?? "status",
        power: entry.move.power,
        accuracy: entry.move.accuracy,
        pp: entry.move.pp,
      });
    } else if (method === "level-up" && entry.level > 0) {
      if (existing.level === 0 || entry.level < existing.level) {
        existing.level = entry.level;
      }
    }
  }

  const result: Record<string, GroupedMove[]> = {};
  for (const [method, bucket] of Object.entries(byMethod)) {
    const list = Array.from(bucket.values());
    list.sort((a, b) => {
      if (method === "level-up" && a.level !== b.level) {
        return a.level - b.level;
      }
      return a.name.localeCompare(b.name);
    });
    result[method] = list;
  }
  return result;
};

const TYPE_COLORS: Record<string, string> = {
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

const DAMAGE_CLASS_LABEL: Record<string, string> = {
  physical: "Physical",
  special: "Special",
  status: "Status",
};

export const MovesCard = ({ moves }: MovesCardProps) => {
  const grouped = useMemo(() => groupMoves(moves), [moves]);
  const methods = useMemo(() => {
    const present = Object.keys(grouped);
    const known = METHOD_ORDER.filter((m) => present.includes(m));
    const extras = present.filter((m) => !METHOD_ORDER.includes(m)).sort();
    return [...known, ...extras];
  }, [grouped]);

  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const currentMethod = activeMethod ?? methods[0] ?? null;
  const currentMoves = currentMethod ? grouped[currentMethod] : [];
  const showLevelColumn = currentMethod === "level-up";

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl md:text-2xl font-bold">Moves</h2>
      </CardHeader>
      <CardContent>
        {methods.length === 0 ? (
          <p className="text-slate-600">No moves found.</p>
        ) : (
          <>
            <div
              role="tablist"
              aria-label="Move learn methods"
              className="flex flex-wrap gap-2 mb-4"
            >
              {methods.map((method) => {
                const isActive = method === currentMethod;
                return (
                  <button
                    key={method}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveMethod(method)}
                    className={[
                      "px-3 py-1.5 rounded-md border text-sm font-medium cursor-pointer transition",
                      isActive
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100",
                    ].join(" ")}
                  >
                    {formatMethodLabel(method)}
                    <span className="ml-1.5 text-xs opacity-75">
                      ({grouped[method].length})
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500 border-b border-slate-200">
                  <tr>
                    {showLevelColumn && (
                      <th className="px-2 py-1 font-medium">Lv.</th>
                    )}
                    <th className="px-2 py-1 font-medium">Move</th>
                    <th className="px-2 py-1 font-medium">Type</th>
                    <th className="px-2 py-1 font-medium">Category</th>
                    <th className="px-2 py-1 font-medium text-right">Pow.</th>
                    <th className="px-2 py-1 font-medium text-right">Acc.</th>
                    <th className="px-2 py-1 font-medium text-right">PP</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMoves.map((move) => (
                    <tr
                      key={move.key}
                      className="border-b border-slate-100 last:border-0"
                    >
                      {showLevelColumn && (
                        <td className="px-2 py-1.5 tabular-nums text-slate-700">
                          {move.level > 0 ? move.level : "—"}
                        </td>
                      )}
                      <td className="px-2 py-1.5 font-medium text-slate-900">
                        {formatMoveName(move.name)}
                      </td>
                      <td className="px-2 py-1.5">
                        <span
                          className={[
                            "inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide",
                            TYPE_COLORS[move.type] ?? "bg-slate-300 text-slate-900",
                          ].join(" ")}
                        >
                          {move.type}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-slate-700">
                        {DAMAGE_CLASS_LABEL[move.damageClass] ?? move.damageClass}
                      </td>
                      <td className="px-2 py-1.5 tabular-nums text-right text-slate-700">
                        {move.power ?? "—"}
                      </td>
                      <td className="px-2 py-1.5 tabular-nums text-right text-slate-700">
                        {move.accuracy ?? "—"}
                      </td>
                      <td className="px-2 py-1.5 tabular-nums text-right text-slate-700">
                        {move.pp ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
