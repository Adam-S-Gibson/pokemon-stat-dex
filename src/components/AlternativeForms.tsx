interface ImageData {
  imageUrl?: string;
  imageAltText?: string;
}

interface AlternativeFormsProps {
  images?: ImageData[];
}

export const AlternativeForms = ({ images = [] }: AlternativeFormsProps) => {
  if (images.length === 0) {
    return (
      <div className="pixel-panel-flat p-4">
        <h2 className="font-pixel text-sm md:text-base mb-2">
          Alternative Forms
        </h2>
        <p className="text-base">No alternative forms.</p>
      </div>
    );
  }

  return (
    <div className="pixel-panel-flat p-4">
      <h2 className="font-pixel text-sm md:text-base mb-4">
        Alternative Forms
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div
            key={image.imageAltText ?? image.imageUrl}
            className="flex flex-col items-center p-2 bg-[var(--color-gb-off)] border-2 border-[var(--color-gb-ink)]"
          >
            <img
              alt={image.imageAltText}
              className="object-contain w-full h-32 md:h-40"
              src={image.imageUrl}
              style={{ aspectRatio: "200/200" }}
              width="200"
              height="200"
            />
            <p className="text-center mt-2 text-[var(--color-gb-shadow)]">
              {image.imageAltText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
