import { typeColorClasses } from "@/lib/pokemonTypes";

interface TypeChipProps {
  type: string;
  size?: "sm" | "md";
}

export const TypeChip = ({ type, size = "sm" }: TypeChipProps) => {
  const sizeClasses =
    size === "md" ? "px-3 py-1 text-[0.65rem]" : "px-2 py-0.5 text-[0.5rem]";
  return (
    <span
      className={[
        "inline-block border-2 border-(--color-gb-ink) font-pixel uppercase tracking-wide",
        sizeClasses,
        typeColorClasses(type),
      ].join(" ")}
    >
      {type}
    </span>
  );
};
