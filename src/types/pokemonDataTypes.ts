export interface PokemonStat {
  base_stat: number;
  pokemonStat: { name: string };
}

export interface PokemonType {
  pokemonType: { name: string };
}

export interface Pokemon {
  pokemon_species_id: number;
  id: number;
  name: string;
  formName?: string;
  pokemonStats: PokemonStat[];
  pokemonTypes: PokemonType[];
  officialArtwork: string | null;
}

interface RawSprites {
  other: {
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface PokemonForm {
  form_name: string;
  pokemonInfo: {
    pokemon_species_id: number;
    id: number;
    name: string;
    pokemonStats: PokemonStat[];
    pokemonTypes: PokemonType[];
    pokemonSprite: Array<{ sprites: RawSprites }>;
  };
}

export interface PokemonResponse {
  pokemon: { forms: PokemonForm[] };
  pokemonCount: { aggregate: { count: number } };
}
