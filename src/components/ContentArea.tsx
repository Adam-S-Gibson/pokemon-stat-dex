import { useContext, useEffect, useState } from "react";
import { AlternativeForms } from "@/components/AlternativeForms";
import { PokemonTitleCard } from "@/components/PokemonTitleCard";
import { StatsCard } from "@/components/StatsCard";
import {
  FetchPokemonResponse,
  IForm,
  IPokemon,
  ISprites,
  Pokemon,
} from "@/types/pokemonDataTypes";
import { PokemonContext } from "@/Providers/PokemonProvider";

export const ContentArea = () => {
  const [pokemon, setPokemon] = useState<Pokemon | undefined>(undefined);
  const [pokemonAltForms, setPokemonAltForms] = useState<Pokemon[] | undefined>(
    undefined,
  );
  const [pokemonCount, setPokemonCount] = useState<number | undefined>(
    undefined,
  );
  const { setMax, currentPokemon } = useContext(PokemonContext);

  const PLACEHOLDER_IMAGE = "https://placehold.co/400";
  const API_URL = "https://beta.pokeapi.co/graphql/v1beta";

  const fetchData = async (pokemonToSearch: number) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          query: `query myQuery($pokemonId: Int!) {
            pokemon: pokemon_v2_pokemonform_aggregate(where: {pokemon_v2_pokemon: {pokemon_species_id: {_eq: $pokemonId}}}) {
              forms: nodes {
                form_name
                pokemonInfo: pokemon_v2_pokemon {
                  pokemon_species_id
                  id
                  name
                  pokemonStats: pokemon_v2_pokemonstats {
                    base_stat
                    pokemonStat: pokemon_v2_stat {
                      name
                    }
                  }
                  pokemonTypes: pokemon_v2_pokemontypes {
                    pokemonType: pokemon_v2_type {
                      name
                    }
                  }
                  pokemonSprite: pokemon_v2_pokemonsprites {
                    sprites
                  }
                }
              }
            }
            pokemonCount: pokemon_v2_pokemon_aggregate {
              aggregate {
                count(columns: pokemon_species_id, distinct: true)
              }
            }
          }         
          `,

          variables: { pokemonId: pokemonToSearch },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createUpdatedSprites = (spritesJson: ISprites) => {
    const officialArtwork = spritesJson.other["official-artwork"];
    return {
      ...spritesJson,
      other: {
        ...spritesJson.other,
        official_artwork: officialArtwork,
      },
    };
  };

  const createUpdatedPokemon = (
    fetchedPokemon: IPokemon,
    updatedSprites: ISprites,
  ) => {
    return {
      ...fetchedPokemon,
      pokemonSprite: updatedSprites,
      pokemon_species_id: fetchedPokemon.pokemon_species_id,
      id: fetchedPokemon.id,
      name: fetchedPokemon.name,
      pokemonStats: fetchedPokemon.pokemonStats,
      pokemonTypes: fetchedPokemon.pokemonTypes,
    };
  };

  const createFetchedPokemonAltForms = (forms: IForm[]) => {
    return forms
      .filter((form) => form.form_name !== "")
      .map((form) => {
        const pokemonInfo = form.pokemonInfo;
        const spritesJson = pokemonInfo.pokemonSprite[0].sprites;
        const updatedSprites = createUpdatedSprites(spritesJson);

        return {
          ...pokemonInfo,
          pokemonSprite: updatedSprites,
          formName: form.form_name,
        };
      });
  };

  const handleFetchDataResponse = (
    response: FetchPokemonResponse | undefined,
  ) => {
    if (response && response.data.pokemon.forms.length > 0) {
      const fetchedPokemonForm = response.data.pokemon.forms[0];
      const fetchedPokemon = fetchedPokemonForm.pokemonInfo;
      setMax(response.data.pokemonCount.aggregate.count);

      const fetchedPokemonAltForms = createFetchedPokemonAltForms(
        response.data.pokemon.forms,
      );
      setPokemonAltForms(fetchedPokemonAltForms as unknown as Pokemon[]);

      if (pokemonCount === undefined) {
        setPokemonCount(response.data.pokemonCount.aggregate.count);
      }

      if (fetchedPokemon.pokemonSprite.length > 0) {
        const spritesJson = fetchedPokemon.pokemonSprite[0].sprites;
        const updatedSprites = createUpdatedSprites(spritesJson);
        const updatedPokemon = createUpdatedPokemon(
          fetchedPokemon,
          updatedSprites,
        );

        setPokemon(updatedPokemon as unknown as Pokemon);
      }
    }
  };

  useEffect(() => {
    fetchData(currentPokemon)
      .then(handleFetchDataResponse)
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPokemon]);

  return (
    <div className="w-full max-w-5xl">
      <main className="flex flex-col md:flex-row grow gap-2">
        <div className="md:w-1/2 md:p-2">
          <PokemonTitleCard
            imageSrc={
              pokemon?.pokemonSprite.other.official_artwork.front_default ??
              PLACEHOLDER_IMAGE
            }
            pokemonName={pokemon?.name}
            pokemonTypes={pokemon?.pokemonTypes.map((type) => {
              return `https://serebii.net/pokedex-bw/type/${type.pokemonType.name}.gif`;
            })}
          ></PokemonTitleCard>
        </div>
        <div className="md:w-1/2 md:p-2">
          <StatsCard pokemon={pokemon}></StatsCard>
        </div>
      </main>
      <aside className="p-4 bg-white mt-4">
        <AlternativeForms
          images={pokemonAltForms?.map((pokemon) => {
            return {
              imageUrl:
                pokemon.pokemonSprite.other.official_artwork.front_default ??
                PLACEHOLDER_IMAGE,
              imageAltText: `${pokemon.formName}`,
            };
          })}
        ></AlternativeForms>
      </aside>
    </div>
  );
};
