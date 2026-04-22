import { Card } from "@/components/ui/card";
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
  if (!pokemonName) return <div>No Pokemon data available.</div>;

  const displayName = formatName(pokemonName);

  return (
    <Card className="h-full flex flex-col items-center justify-center bg-[#eeeeee] p-6">
      <img
        alt={displayName}
        className="object-contain w-3/4 h-3/4"
        src={imageSrc}
      />
      <h1 className="text-2xl md:text-4xl font-bold mt-4 md:mt-8">
        {displayName}
      </h1>
      <div className="flex space-x-2 p-2">
        {pokemonTypes.map((type) => (
          <img key={type} src={type} alt="" className="w-auto" />
        ))}
      </div>
    </Card>
  );
};
