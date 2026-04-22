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
    <div className="min-h-screen flex flex-col items-center bg-slate-100 py-8 px-4">
      <header className="w-full max-w-6xl mb-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          National Pokédex
        </h1>
        <p className="text-slate-600 mt-2">
          Pick a generation, then choose a Pokémon.
        </p>
      </header>

      <nav
        aria-label="Generations"
        className="w-full max-w-6xl flex flex-wrap justify-center gap-2 mb-6"
      >
        {generations.map((gen) => {
          const isActive = gen.id === selectedGen;
          return (
            <button
              key={gen.id}
              onClick={() => setSelectedGen(gen.id)}
              aria-pressed={isActive}
              className={[
                "px-4 py-2 rounded-md border shadow-sm transition",
                "text-sm md:text-base font-medium cursor-pointer",
                isActive
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-800 border-slate-300 hover:bg-slate-200",
              ].join(" ")}
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
            className="group flex flex-col items-center p-2 bg-white rounded-lg border border-slate-200 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:scale-110 hover:shadow-md hover:z-10 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <img
              src={pixelSpriteUrl(species.id)}
              alt={formatName(species.name)}
              width={96}
              height={96}
              loading="lazy"
              className="h-20 w-20 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
            <span className="text-xs text-slate-500 mt-1">
              #{padId(species.id)}
            </span>
            <span className="text-sm font-medium text-slate-800">
              {formatName(species.name)}
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
};
