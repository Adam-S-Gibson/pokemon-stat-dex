import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AlternativeForms } from "@/components/AlternativeForms";
import { MovesCard } from "@/components/MovesCard";
import { PokemonTitleCard } from "@/components/PokemonTitleCard";
import { SpritesByGenerationCard } from "@/components/SpritesByGenerationCard";
import { StatsCard } from "@/components/StatsCard";
import {
  fetchGraphQL,
  POKEMON_CORE_QUERY,
  POKEMON_MOVES_QUERY,
} from "@/lib/pokeapi";
import { parseGenerationKey } from "@/lib/generations";
import {
  GenerationSprites,
  Pokemon,
  PokemonForm,
  PokemonCoreResponse,
  PokemonMovesResponse,
  RawSprites,
} from "@/types/pokemonDataTypes";
import { PokemonContext } from "@/Providers/PokemonProvider";

const PLACEHOLDER_IMAGE = "https://placehold.co/400";

const extractSpriteGenerations = (
  sprites: RawSprites | undefined,
): GenerationSprites[] => {
  if (!sprites?.versions) return [];
  return Object.entries(sprites.versions)
    .map(([generationKey, games]) => ({
      generationKey,
      generation: parseGenerationKey(generationKey),
      games: Object.entries(games ?? {})
        .map(([gameKey, game]) => ({
          gameKey,
          url: game?.front_default ?? null,
        }))
        .filter((g): g is { gameKey: string; url: string } => g.url !== null),
    }))
    .filter((entry) => entry.games.length > 0)
    .sort((a, b) => a.generation - b.generation);
};

const normalizePokemon = (form: PokemonForm): Pokemon => {
  const { pokemonInfo, form_name } = form;
  const rawSprites = pokemonInfo.pokemonSprite[0]?.sprites;
  const artwork =
    rawSprites?.other["official-artwork"].front_default ?? null;
  return {
    pokemon_species_id: pokemonInfo.pokemon_species_id,
    id: pokemonInfo.id,
    name: pokemonInfo.name,
    formName: form_name,
    pokemonStats: pokemonInfo.pokemonStats,
    pokemonTypes: pokemonInfo.pokemonTypes,
    pokemonMoves: [],
    officialArtwork: artwork,
    spriteGenerations: extractSpriteGenerations(rawSprites),
  };
};

export const ContentArea = () => {
  const { setMax } = useContext(PokemonContext);
  const { id } = useParams<{ id: string }>();
  const currentPokemon = Number(id) || 1;
  const [core, setCore] = useState<{
    id: number;
    pokemon: Pokemon;
    altForms: Pokemon[];
  }>();
  const [moveState, setMoveState] = useState<{
    id: number;
    moves: Pokemon["pokemonMoves"];
  }>();

  useEffect(() => {
    let cancelled = false;
    fetchGraphQL<PokemonCoreResponse>(POKEMON_CORE_QUERY, {
      pokemonId: currentPokemon,
    })
      .then((data) => {
        if (cancelled || data.pokemon.forms.length === 0) return;
        setMax(data.pokemonCount.aggregate.count);
        setCore({
          id: currentPokemon,
          pokemon: normalizePokemon(data.pokemon.forms[0]),
          altForms: data.pokemon.forms
            .filter((form) => form.form_name !== "")
            .map(normalizePokemon),
        });
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [currentPokemon, setMax]);

  useEffect(() => {
    let cancelled = false;
    fetchGraphQL<PokemonMovesResponse>(POKEMON_MOVES_QUERY, {
      pokemonId: currentPokemon,
    })
      .then((data) => {
        if (cancelled) return;
        const primary = data.pokemon.forms[0];
        setMoveState({
          id: currentPokemon,
          moves: primary?.pokemonInfo.pokemonMoves ?? [],
        });
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [currentPokemon]);

  const pokemon = core?.id === currentPokemon ? core.pokemon : undefined;
  const altForms = core?.id === currentPokemon ? core.altForms : [];
  const movesLoaded = moveState?.id === currentPokemon;
  const moves = movesLoaded ? moveState!.moves : [];
  const movesLoading = !movesLoaded;

  const typeNames = pokemon?.pokemonTypes.map((t) => t.pokemonType.name);

  return (
    <div className="w-full max-w-5xl">
      <main className="flex flex-col md:flex-row grow gap-2">
        <div className="md:w-1/2 md:p-2">
          <PokemonTitleCard
            imageSrc={pokemon?.officialArtwork ?? PLACEHOLDER_IMAGE}
            pokemonName={pokemon?.name}
            pokemonTypes={typeNames}
          />
        </div>
        <div className="md:w-1/2 md:p-2">
          <StatsCard pokemon={pokemon} />
        </div>
      </main>
      <aside className="mt-4">
        <AlternativeForms
          images={altForms.map((form) => ({
            imageUrl: form.officialArtwork ?? PLACEHOLDER_IMAGE,
            imageAltText: form.formName ?? form.name,
          }))}
        />
      </aside>
      <hr className="pixel-divider my-4" />
      <section className="mt-4">
        <SpritesByGenerationCard
          generations={pokemon?.spriteGenerations ?? []}
          pokemonName={pokemon?.name}
        />
      </section>
      <section className="mt-4">
        <MovesCard moves={moves} loading={movesLoading} />
      </section>
    </div>
  );
};
