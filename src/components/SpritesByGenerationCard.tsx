import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GenerationSprites } from "@/types/pokemonDataTypes";
import { generationLabel } from "@/lib/generations";
import { formatName } from "@/lib/utils";

interface SpritesByGenerationCardProps {
  generations: GenerationSprites[];
  pokemonName?: string;
}

const GAME_LABELS: Record<string, string> = {
  "red-blue": "Red/Blue",
  yellow: "Yellow",
  gold: "Gold",
  silver: "Silver",
  crystal: "Crystal",
  "ruby-sapphire": "Ruby/Sapphire",
  emerald: "Emerald",
  "firered-leafgreen": "FireRed/LeafGreen",
  "diamond-pearl": "Diamond/Pearl",
  platinum: "Platinum",
  "heartgold-soulsilver": "HeartGold/SoulSilver",
  "black-white": "Black/White",
  colosseum: "Colosseum",
  xd: "XD: Gale of Darkness",
  "x-y": "X/Y",
  "omegaruby-alphasapphire": "Omega Ruby/Alpha Sapphire",
  "ultra-sun-ultra-moon": "Ultra Sun/Ultra Moon",
  icons: "HOME",
};

const formatGameLabel = (key: string): string =>
  GAME_LABELS[key] ??
  key
    .split("-")
    .map((word) => formatName(word))
    .join(" ");

export const SpritesByGenerationCard = ({
  generations,
  pokemonName,
}: SpritesByGenerationCardProps) => {
  if (generations.length === 0) return null;

  const displayName = pokemonName ? formatName(pokemonName) : "Pokémon";

  return (
    <Card>
      <CardHeader>
        <h2 className="font-pixel text-base md:text-lg">
          Sprites by Generation
        </h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {generations.map((gen) => (
          <section key={gen.generationKey}>
            <h3 className="font-pixel text-[0.65rem] uppercase tracking-wide mb-3 text-[var(--color-gb-shadow)]">
              {generationLabel(gen.generation)}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {gen.games.map((game) => (
                <figure
                  key={game.gameKey}
                  className="flex flex-col items-center justify-center p-3 bg-[var(--color-gb-off)] border-2 border-[var(--color-gb-ink)]"
                >
                  <img
                    src={game.url}
                    alt={`${displayName} sprite from ${formatGameLabel(game.gameKey)}`}
                    width={96}
                    height={96}
                    loading="lazy"
                    className="h-20 w-20 object-contain"
                  />
                  <figcaption className="text-sm mt-2 text-center text-[var(--color-gb-shadow)]">
                    {formatGameLabel(game.gameKey)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </CardContent>
    </Card>
  );
};
