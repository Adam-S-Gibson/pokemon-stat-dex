export interface PokemonFormAggregateResponse {
  pokemon: {
    form: Pokemon[];
  };
  pokemonCount: {
    aggregate: {
      count: number;
    };
  };
}

export interface Pokemon {
  pokemon_species_id: number;
  id: number;
  name: string;
  formName?: string;
  pokemonStats: PokemonStat[];
  pokemonTypes: PokemonType[];
  pokemonSprite: Sprites;
}

export interface PokemonStat {
  base_stat: number;
  pokemonStat: {
    name: string;
  };
}

export interface PokemonType {
  pokemonType: {
    name: string;
  };
}

export interface Sprites {
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  other: OtherSprites;
  versions: Versions;
}

interface OtherSprites {
  dream_world: {
    front_default: string | null;
    front_female: string | null;
  };
  home: {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
  };
  official_artwork: {
    front_default: string | null;
    front_shiny: string | null;
  };
}

interface Versions {
  [key: string]: Generation;
}

interface Generation {
  [key: string]: {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
  };
}

export interface ISprites {
  other: {
    official_artwork: string;
    [key: string]: string;
  };
  [key: string]: unknown;
}

export interface IPokemon {
  pokemonSprite: { sprites: ISprites }[];
  pokemon_species_id: number;
  id: number;
  name: string;
  pokemonStats: PokemonStat[];
  pokemonTypes: PokemonType[];
}

export interface IForm {
  form_name: string;
  pokemonInfo: IPokemon;
}

export interface FetchPokemonResponse {
  data: {
    pokemon: { forms: IForm[] };
    pokemonCount: { aggregate: { count: number } };
  };
}
