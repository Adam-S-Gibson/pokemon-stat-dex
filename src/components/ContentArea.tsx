import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AlternativeForms } from "@/components/AlternativeForms";
import { MovesCard } from "@/components/MovesCard";
import { PokemonTitleCard } from "@/components/PokemonTitleCard";
import { StatsCard } from "@/components/StatsCard";
import { fetchGraphQL, POKEMON_QUERY } from "@/lib/pokeapi";
import {
  Pokemon,
  PokemonForm,
  PokemonResponse,
} from "@/types/pokemonDataTypes";
import { PokemonContext } from "@/Providers/PokemonProvider";

const PLACEHOLDER_IMAGE = "https://placehold.co/400";
const typeIconUrl = (name: string) =>
  `https://serebii.net/pokedex-bw/type/${name}.gif`;

const normalizePokemon = (form: PokemonForm): Pokemon => {
  const { pokemonInfo, form_name } = form;
  const artwork =
    pokemonInfo.pokemonSprite[0]?.sprites.other["official-artwork"]
      .front_default ?? null;
  return {
    pokemon_species_id: pokemonInfo.pokemon_species_id,
    id: pokemonInfo.id,
    name: pokemonInfo.name,
    formName: form_name,
    pokemonStats: pokemonInfo.pokemonStats,
    pokemonTypes: pokemonInfo.pokemonTypes,
    pokemonMoves: pokemonInfo.pokemonMoves ?? [],
    officialArtwork: artwork,
  };
};

export const ContentArea = () => {
  const { setMax } = useContext(PokemonContext);
  const { id } = useParams<{ id: string }>();
  const currentPokemon = Number(id) || 1;
  const [pokemon, setPokemon] = useState<Pokemon>();
  const [altForms, setAltForms] = useState<Pokemon[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchGraphQL<PokemonResponse>(POKEMON_QUERY, { pokemonId: currentPokemon })
      .then((data) => {
        if (cancelled || data.pokemon.forms.length === 0) return;
        setMax(data.pokemonCount.aggregate.count);
        setPokemon(normalizePokemon(data.pokemon.forms[0]));
        setAltForms(
          data.pokemon.forms
            .filter((form) => form.form_name !== "")
            .map(normalizePokemon),
        );
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [currentPokemon, setMax]);

  const typeIcons = pokemon?.pokemonTypes.map((t) =>
    typeIconUrl(t.pokemonType.name),
  );

  return (
    <div className="w-full max-w-5xl">
      <main className="flex flex-col md:flex-row grow gap-2">
        <div className="md:w-1/2 md:p-2">
          <PokemonTitleCard
            imageSrc={pokemon?.officialArtwork ?? PLACEHOLDER_IMAGE}
            pokemonName={pokemon?.name}
            pokemonTypes={typeIcons}
          />
        </div>
        <div className="md:w-1/2 md:p-2">
          <StatsCard pokemon={pokemon} />
        </div>
      </main>
      <aside className="p-4 bg-white mt-4">
        <AlternativeForms
          images={altForms.map((form) => ({
            imageUrl: form.officialArtwork ?? PLACEHOLDER_IMAGE,
            imageAltText: form.formName ?? form.name,
          }))}
        />
      </aside>
      <section className="mt-4">
        <MovesCard moves={pokemon?.pokemonMoves ?? []} />
      </section>
    </div>
  );
};
