const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

const ANIMATED_SPRITE_MAX_ID = 649;

export const pixelSpriteUrl = (id: number): string =>
  id <= ANIMATED_SPRITE_MAX_ID
    ? `${SPRITE_BASE}/versions/generation-v/black-white/animated/${id}.gif`
    : `${SPRITE_BASE}/${id}.png`;

export const staticSpriteUrl = (id: number): string =>
  `${SPRITE_BASE}/${id}.png`;
