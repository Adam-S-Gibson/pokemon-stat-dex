export interface PokemonStat {
  base_stat: number;
  pokemonStat: { name: string };
}

export interface PokemonType {
  pokemonType: { name: string };
}

export interface PokemonMoveDetails {
  name: string;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  moveType: { name: string };
  damageClass: { name: string } | null;
}

export interface PokemonMove {
  level: number;
  moveLearnMethod: { name: string };
  versionGroup: { name: string };
  move: PokemonMoveDetails;
}

export interface Pokemon {
  pokemon_species_id: number;
  id: number;
  name: string;
  formName?: string;
  pokemonStats: PokemonStat[];
  pokemonTypes: PokemonType[];
  pokemonMoves: PokemonMove[];
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
    pokemonMoves: PokemonMove[];
  };
}

export interface PokemonResponse {
  pokemon: { forms: PokemonForm[] };
  pokemonCount: { aggregate: { count: number } };
}
