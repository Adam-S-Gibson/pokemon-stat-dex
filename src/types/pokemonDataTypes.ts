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

export interface GameSprite {
  gameKey: string;
  url: string;
}

export interface GenerationSprites {
  generation: number;
  generationKey: string;
  games: GameSprite[];
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
  spriteGenerations: GenerationSprites[];
}

interface RawSpriteGame {
  front_default?: string | null;
}

export interface RawSprites {
  other: {
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
  versions?: Record<string, Record<string, RawSpriteGame | null | undefined>>;
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

export interface PokemonCoreResponse {
  pokemon: { forms: PokemonForm[] };
  pokemonCount: { aggregate: { count: number } };
}

export interface PokemonMovesForm {
  form_name: string;
  pokemonInfo: {
    id: number;
    pokemonMoves: PokemonMove[];
  };
}

export interface PokemonMovesResponse {
  pokemon: { forms: PokemonMovesForm[] };
}
