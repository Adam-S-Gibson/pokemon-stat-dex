const API_URL = "https://beta.pokeapi.co/graphql/v1beta";

export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

export const POKEMON_CORE_QUERY = `query pokemonCoreById($pokemonId: Int!) {
  pokemon: pokemon_v2_pokemonform_aggregate(
    where: { pokemon_v2_pokemon: { pokemon_species_id: { _eq: $pokemonId } } }
  ) {
    forms: nodes {
      form_name
      pokemonInfo: pokemon_v2_pokemon {
        pokemon_species_id
        id
        name
        pokemonStats: pokemon_v2_pokemonstats {
          base_stat
          pokemonStat: pokemon_v2_stat { name }
        }
        pokemonTypes: pokemon_v2_pokemontypes {
          pokemonType: pokemon_v2_type { name }
        }
        pokemonSprite: pokemon_v2_pokemonsprites { sprites }
      }
    }
  }
  pokemonCount: pokemon_v2_pokemon_aggregate {
    aggregate { count(columns: pokemon_species_id, distinct: true) }
  }
}`;

export const POKEMON_MOVES_QUERY = `query pokemonMovesById($pokemonId: Int!) {
  pokemon: pokemon_v2_pokemonform_aggregate(
    where: { pokemon_v2_pokemon: { pokemon_species_id: { _eq: $pokemonId } } }
  ) {
    forms: nodes {
      form_name
      pokemonInfo: pokemon_v2_pokemon {
        id
        pokemonMoves: pokemon_v2_pokemonmoves(
          order_by: [{level: asc}, {move_id: asc}]
        ) {
          level
          moveLearnMethod: pokemon_v2_movelearnmethod { name }
          versionGroup: pokemon_v2_versiongroup { name }
          move: pokemon_v2_move {
            name
            power
            accuracy
            pp
            moveType: pokemon_v2_type { name }
            damageClass: pokemon_v2_movedamageclass { name }
          }
        }
      }
    }
  }
}`;

export const POKEMON_LIST_QUERY = `query pokemonList($limit: Int!) {
  pokemonList: pokemon_v2_pokemon(distinct_on: id, limit: $limit) {
    name
    pokemon_species_id
  }
}`;

export const GENERATIONS_QUERY = `query generationsGrid {
  generations: pokemon_v2_generation(order_by: {id: asc}) {
    id
    name
    species: pokemon_v2_pokemonspecies(order_by: {id: asc}) {
      id
      name
    }
  }
}`;
