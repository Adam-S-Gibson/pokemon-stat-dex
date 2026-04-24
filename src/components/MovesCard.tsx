import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TypeChip } from "@/components/TypeChip";
import { PokemonMove } from "@/types/pokemonDataTypes";
import { formatName } from "@/lib/utils";

interface MovesCardProps {
  moves: PokemonMove[];
  loading?: boolean;
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

const groupMoves = (moves: PokemonMove[]): Record<string, GroupedMove[]> => {
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

const DAMAGE_CLASS_LABEL: Record<string, string> = {
  physical: "Physical",
  special: "Special",
  status: "Status",
};

export const MovesCard = ({ moves, loading = false }: MovesCardProps) => {
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
        <h2 className="font-pixel text-base md:text-lg">Moves</h2>
      </CardHeader>
      <CardContent>
        {loading && methods.length === 0 ? (
          <p className="text-base text-(--color-gb-shadow)">Loading moves…</p>
        ) : methods.length === 0 ? (
          <p className="text-base">No moves found.</p>
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
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-pressed={isActive}
                    onClick={() => setActiveMethod(method)}
                    className="pixel-button text-[0.55rem]!"
                  >
                    {formatMethodLabel(method)}
                    <span className="ml-1.5 opacity-75">
                      ({grouped[method].length})
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="overflow-x-auto border-2 border-(--color-gb-ink)">
              <table className="w-full text-base">
                <thead className="bg-(--color-gb-ink) text-(--color-gb-off) font-pixel text-[0.55rem] uppercase">
                  <tr>
                    {showLevelColumn && (
                      <th className="px-2 py-2 text-left">Lv.</th>
                    )}
                    <th className="px-2 py-2 text-left">Move</th>
                    <th className="px-2 py-2 text-left">Type</th>
                    <th className="px-2 py-2 text-left">Cat.</th>
                    <th className="px-2 py-2 text-right">Pow.</th>
                    <th className="px-2 py-2 text-right">Acc.</th>
                    <th className="px-2 py-2 text-right">PP</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMoves.map((move, idx) => (
                    <tr
                      key={move.key}
                      className={
                        idx % 2 === 0
                          ? "bg-(--color-gb-off)"
                          : "bg-(--color-gb-screen-light)"
                      }
                    >
                      {showLevelColumn && (
                        <td className="px-2 py-1.5 tabular-nums">
                          {move.level > 0 ? move.level : "—"}
                        </td>
                      )}
                      <td className="px-2 py-1.5 font-semibold">
                        {formatMoveName(move.name)}
                      </td>
                      <td className="px-2 py-1.5">
                        <TypeChip type={move.type} />
                      </td>
                      <td className="px-2 py-1.5">
                        {DAMAGE_CLASS_LABEL[move.damageClass] ??
                          move.damageClass}
                      </td>
                      <td className="px-2 py-1.5 tabular-nums text-right">
                        {move.power ?? "—"}
                      </td>
                      <td className="px-2 py-1.5 tabular-nums text-right">
                        {move.accuracy ?? "—"}
                      </td>
                      <td className="px-2 py-1.5 tabular-nums text-right">
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
