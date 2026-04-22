import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { fetchGraphQL, GENERATIONS_QUERY } from "@/lib/pokeapi";
import { generationLabel } from "@/lib/generations";
import { pixelSpriteUrl } from "@/lib/sprites";
import { formatName } from "@/lib/utils";
import { PokemonContext } from "@/Providers/PokemonProvider";

interface GenerationSpecies {
  id: number;
  name: string;
}

interface Generation {
  id: number;
  name: string;
  species: GenerationSpecies[];
}

interface GenerationsResponse {
  generations: Generation[];
}

const padId = (id: number) => String(id).padStart(4, "0");

export const HomePage = () => {
  const { setMax } = useContext(PokemonContext);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedGen, setSelectedGen] = useState<number>(1);

  useEffect(() => {
    let cancelled = false;
    fetchGraphQL<GenerationsResponse>(GENERATIONS_QUERY)
      .then((data) => {
        if (cancelled) return;
        setGenerations(data.generations);
        const total = data.generations.reduce(
          (sum, gen) => sum + gen.species.length,
          0,
        );
        if (total > 0) setMax(total);
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [setMax]);

  const currentSpecies = useMemo(
    () => generations.find((g) => g.id === selectedGen)?.species ?? [],
    [generations, selectedGen],
  );

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4">
      <header className="w-full max-w-6xl mb-8 text-center">
        <h1 className="font-pixel text-xl md:text-3xl leading-tight">
          National
          <br className="md:hidden" /> Pokédex
        </h1>
        <p className="mt-3 text-lg text-(--color-gb-shadow)">
          Pick a generation, choose a Pokémon.
        </p>
      </header>

      <nav
        aria-label="Generations"
        className="w-full max-w-6xl flex flex-wrap justify-center gap-3 mb-8"
      >
        {generations.map((gen) => {
          const isActive = gen.id === selectedGen;
          return (
            <button
              key={gen.id}
              type="button"
              onClick={() => setSelectedGen(gen.id)}
              aria-pressed={isActive}
              className="pixel-button"
            >
              {generationLabel(gen.id)}
            </button>
          );
        })}
      </nav>

      <section
        aria-label={`Generation ${selectedGen} Pokémon`}
        className="w-full max-w-6xl grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"
      >
        {currentSpecies.map((species) => (
          <Link
            key={species.id}
            to={`/pokemon/${species.id}`}
            className="pixel-panel-flat group flex flex-col items-center p-2 transition-transform duration-200 hover:-translate-y-1 hover:scale-110 hover:shadow-[4px_4px_0_var(--color-gb-ink)] hover:z-10 focus:outline-none focus:ring-2 focus:ring-(--color-gb-ink)"
          >
            <img
              src={pixelSpriteUrl(species.id)}
              alt={formatName(species.name)}
              width={96}
              height={96}
              loading="lazy"
              className="h-20 w-20 object-contain"
            />
            <span className="font-pixel text-[0.55rem] mt-1 text-(--color-gb-shadow)">
              #{padId(species.id)}
            </span>
            <span className="text-base text-(--color-gb-ink) truncate max-w-full">
              {formatName(species.name)}
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
};
