import { JSX, SVGProps, useContext, useEffect, useState } from "react";
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

export const NavigationBar = () => {
  const { currentPokemon, setCurrentPokemon, max } = useContext(PokemonContext);

  return (
    <div className="p-2 w-full max-w-5xl">
      <div className="flex items-center justify-between bg-white rounded-md shadow-md">
        <img
          alt="Website logo"
          className="h-16 w-16 mr-2 top-2 left-2 cursor-pointer"
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
          onClick={() => setCurrentPokemon(1)}
        />
        <div className="flex items-center">
          <button
            className="p-2 transition ease-in-out hover:scale-150 duration-300 rounded-full"
            disabled={currentPokemon === 1}
            aria-label="Previous Pokemon"
            onClick={() => {
              if (currentPokemon > 1) {
                setCurrentPokemon(currentPokemon - 1);
              }
            }}
          >
            <ArrowIcon direction="left" className="w-4 h-4 " />
          </button>
        </div>
        <SearchBar />
        <button
          className="p-2 mr-2 transition ease-in-out hover:scale-150 duration-300 rounded-full"
          disabled={currentPokemon === max}
          aria-label="Next Pokemon"
          onClick={() => {
            if (currentPokemon < max) {
              setCurrentPokemon(currentPokemon + 1);
            }
          }}
        >
          <ArrowIcon direction="right" className="w-4 h-4 " />
        </button>
      </div>
    </div>
  );
};

type ArrowIconProps = JSX.IntrinsicAttributes &
  SVGProps<SVGSVGElement> & { direction: "left" | "right" };

function ArrowIcon({ direction, ...props }: ArrowIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <>
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </>
      ) : (
        <>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </>
      )}
    </svg>
  );
}

interface PokemonSearchBox {
  label: string;
  value: string;
}

const API_URL = "https://beta.pokeapi.co/graphql/v1beta";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [searchList, setSearchList] = useState<PokemonSearchBox[]>([]);
  const { max, setCurrentPokemon } = useContext(PokemonContext);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {},
        body: JSON.stringify({
          query: `query samplePokeAPIquery {
            pokemonList: pokemon_v2_pokemon(distinct_on: id, limit: ${max}) {
              name
              id
              pokemon_species_id
            }
          }
          `,

          variables: {},
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.data.pokemonList;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  useEffect(() => {
    fetchData()
      .then((entries) => {
        const pokedexEntries = entries.map(
          (entry: { pokemon_species_id: number; name: string }) => {
            return {
              value: entry.pokemon_species_id.toString(),
              label: formatName(entry.name),
            };
          },
        );
        setSearchList(pokedexEntries);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          {"Select Pokemon..."}
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
              {searchList.map((pokemon) => (
                <CommandItem
                  key={pokemon.value}
                  value={pokemon.label}
                  onSelect={() => {
                    setOpen(false);
                    setCurrentPokemon(parseInt(pokemon.value));
                  }}
                >
                  {pokemon.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
