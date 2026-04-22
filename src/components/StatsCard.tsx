import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Pokemon } from "@/types/pokemonDataTypes";

interface StatsCardProps {
  pokemon?: Pokemon;
}

const formatStatName = (name: string): string =>
  name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const MAX_STAT = 255;

export const StatsCard = ({ pokemon }: StatsCardProps) => {
  const stats = pokemon?.pokemonStats.map((stat) => ({
    name: formatStatName(stat.pokemonStat.name),
    value: stat.base_stat,
  }));

  const total = stats?.reduce((sum, stat) => sum + stat.value, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="font-pixel text-base md:text-lg">Stats</h2>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {stats?.map((stat) => {
            const pct = Math.min(100, (stat.value / MAX_STAT) * 100);
            return (
              <li key={stat.name}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-pixel text-[0.6rem] uppercase tracking-wide">
                    {stat.name}
                  </span>
                  <span className="tabular-nums text-lg">{stat.value}</span>
                </div>
                <div
                  className="h-3 w-full border-2 border-[var(--color-gb-ink)] bg-[var(--color-gb-off)]"
                  role="meter"
                  aria-valuenow={stat.value}
                  aria-valuemin={0}
                  aria-valuemax={MAX_STAT}
                >
                  <div
                    className="h-full bg-[var(--color-gb-ink)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
          {total !== undefined && (
            <li className="flex justify-between items-baseline pt-2 border-t-2 border-dashed border-[var(--color-gb-ink)]">
              <span className="font-pixel text-[0.65rem] uppercase">Total</span>
              <span className="tabular-nums text-xl font-pixel">{total}</span>
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
