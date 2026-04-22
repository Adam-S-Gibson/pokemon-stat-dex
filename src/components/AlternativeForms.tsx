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
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Alternative Forms
        </h2>
        <p>No Alternative Forms.</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl md:text-2xl font-bold mb-4">Alternative Forms</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.imageAltText ?? image.imageUrl}>
            <img
              alt={image.imageAltText}
              className="object-contain w-full h-32 md:h-48"
              src={image.imageUrl}
              style={{ aspectRatio: "200/200" }}
              width="200"
              height="200"
            />
            <p className="text-center mt-2">{image.imageAltText}</p>
          </div>
        ))}
      </div>
    </>
  );
};
