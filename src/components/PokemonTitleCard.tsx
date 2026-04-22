import { Card } from "@/components/ui/card";
import { TypeChip } from "@/components/TypeChip";
import { formatName } from "@/lib/utils";

interface TitleCardProps {
  imageSrc?: string;
  pokemonName?: string;
  pokemonTypes?: string[];
}

export const PokemonTitleCard = ({
  imageSrc,
  pokemonName,
  pokemonTypes = [],
}: TitleCardProps) => {
  if (!pokemonName) {
    return (
      <Card className="h-full flex items-center justify-center p-6">
        <p className="text-lg">No Pokémon data available.</p>
      </Card>
    );
  }

  const displayName = formatName(pokemonName);

  return (
    <Card className="h-full flex flex-col items-center justify-center p-6">
      <div className="w-3/4 aspect-square flex items-center justify-center bg-(--color-gb-screen-light) border-2 border-(--color-gb-ink)">
        <img
          alt={displayName}
          className="object-contain w-full h-full p-4"
          src={imageSrc}
        />
      </div>
      <h1 className="font-pixel text-base md:text-lg mt-6 text-center">
        {displayName}
      </h1>
      <div className="flex flex-wrap justify-center gap-2 p-2">
        {pokemonTypes.map((type) => (
          <TypeChip key={type} type={type} size="md" />
        ))}
      </div>
    </Card>
  );
};
