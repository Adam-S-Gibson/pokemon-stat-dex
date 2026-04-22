import { createContext } from "react";

export const PokemonContext = createContext({
  max: 1000,
  setMax: (_max: number) => {},
});
