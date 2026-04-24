import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { PokemonContext } from "@/Providers/PokemonProvider";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<PokemonEntry[]>([]);
  const { max } = useContext(PokemonContext);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
      <Command
        shouldFilter
        className="pixel-panel-flat overflow-visible bg-(--color-gb-off) [&_[cmdk-input-wrapper]]:border-b-0"
      >
        <CommandInput
          placeholder="Select Pokemon..."
          value={query}
          onValueChange={setQuery}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className="text-lg text-(--color-gb-ink) placeholder:text-(--color-gb-shadow)"
        />
        {open && (
          <CommandList className="pixel-panel-flat absolute top-full left-0 right-0 z-50 mt-1 max-h-75 bg-(--color-gb-off) shadow-[4px_4px_0_var(--color-gb-ink)]">
            <CommandEmpty className="py-4 text-center text-(--color-gb-shadow)">
              No pokemon found.
            </CommandEmpty>
            <CommandGroup>
              {entries.map((entry) => (
                <CommandItem
                  key={entry.value}
                  value={entry.label}
                  onSelect={() => {
                    setOpen(false);
                    setQuery("");
                    navigate(`/pokemon/${entry.value}`);
                  }}
                  className="text-base text-(--color-gb-ink) aria-selected:bg-(--color-gb-screen-light)"
                >
                  {entry.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
};
