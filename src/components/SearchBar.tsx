import { useContext, useEffect, useState } from "react";
import { PokemonContext } from "@/Providers/PokemonProvider";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchGraphQL, POKEMON_LIST_QUERY } from "@/lib/pokeapi";
import { formatName } from "@/lib/utils";

interface PokemonEntry {
  label: string;
  value: number;
}

interface PokemonListResponse {
  pokemonList: Array<{ pokemon_species_id: number; name: string }>;
}

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<PokemonEntry[]>([]);
  const { max, setCurrentPokemon } = useContext(PokemonContext);

  useEffect(() => {
    let cancelled = false;
    fetchGraphQL<PokemonListResponse>(POKEMON_LIST_QUERY, { limit: max })
      .then((data) => {
        if (cancelled) return;
        setEntries(
          data.pokemonList.map((entry) => ({
            value: entry.pokemon_species_id,
            label: formatName(entry.name),
          })),
        );
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [max]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full cursor-pointer"
        >
          Select Pokemon...
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) sm:w-96 p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandInput placeholder="Search Pokemon..." />
          <CommandList>
            <CommandEmpty>No pokemon found.</CommandEmpty>
            <CommandGroup>
              {entries.map((entry) => (
                <CommandItem
                  key={entry.value}
                  value={entry.label}
                  onSelect={() => {
                    setOpen(false);
                    setCurrentPokemon(entry.value);
                  }}
                >
                  {entry.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
