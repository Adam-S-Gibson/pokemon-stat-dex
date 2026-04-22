import { SVGProps, useContext } from "react";
import { PokemonContext } from "@/Providers/PokemonProvider";
import { SearchBar } from "@/components/SearchBar";

const POKEBALL_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg";

export const NavigationBar = () => {
  const { currentPokemon, setCurrentPokemon, max } = useContext(PokemonContext);

  return (
    <div className="p-2 w-full max-w-5xl">
      <div className="flex items-center justify-between bg-white rounded-md shadow-md">
        <img
          alt="Reset to first Pokemon"
          className="h-16 w-16 mr-2 cursor-pointer"
          src={POKEBALL_LOGO}
          onClick={() => setCurrentPokemon(1)}
        />
        <NavButton
          direction="left"
          ariaLabel="Previous Pokemon"
          disabled={currentPokemon <= 1}
          onClick={() => setCurrentPokemon(currentPokemon - 1)}
        />
        <SearchBar />
        <NavButton
          direction="right"
          ariaLabel="Next Pokemon"
          disabled={currentPokemon >= max}
          onClick={() => setCurrentPokemon(currentPokemon + 1)}
        />
      </div>
    </div>
  );
};

interface NavButtonProps {
  direction: "left" | "right";
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
}

const NavButton = ({
  direction,
  ariaLabel,
  disabled,
  onClick,
}: NavButtonProps) => (
  <button
    className="p-2 mx-2 transition ease-in-out hover:scale-150 duration-300 rounded-full"
    disabled={disabled}
    aria-label={ariaLabel}
    onClick={onClick}
  >
    <ArrowIcon direction={direction} className="w-4 h-4" />
  </button>
);

type ArrowIconProps = SVGProps<SVGSVGElement> & {
  direction: "left" | "right";
};

const ArrowIcon = ({ direction, ...props }: ArrowIconProps) => (
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
