import { SVGProps, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { PokemonContext } from "@/Providers/PokemonProvider";
import { SearchBar } from "@/components/SearchBar";

const POKEBALL_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg";

export const NavigationBar = () => {
  const { max } = useContext(PokemonContext);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const currentPokemon = Number(id) || 1;

  return (
    <div className="p-2 w-full max-w-5xl">
      <div className="pixel-panel flex items-center justify-between gap-2 p-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Back to Pokédex home"
          className="shrink-0 p-1 border-2 border-(--color-gb-ink) bg-(--color-gb-off) cursor-pointer hover:translate-y-px transition-transform"
        >
          <img alt="" className="h-10 w-10" src={POKEBALL_LOGO} />
        </button>
        <NavButton
          direction="left"
          ariaLabel="Previous Pokemon"
          disabled={currentPokemon <= 1}
          onClick={() => navigate(`/pokemon/${currentPokemon - 1}`)}
        />
        <div className="flex-1 min-w-0">
          <SearchBar />
        </div>
        <NavButton
          direction="right"
          ariaLabel="Next Pokemon"
          disabled={currentPokemon >= max}
          onClick={() => navigate(`/pokemon/${currentPokemon + 1}`)}
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
    type="button"
    className="pixel-button px-2! py-2!"
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
    strokeWidth="3"
    strokeLinecap="square"
    strokeLinejoin="miter"
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
