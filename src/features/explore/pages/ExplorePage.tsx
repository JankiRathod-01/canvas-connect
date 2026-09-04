import { ArtworkCard } from "@/features/explore/components/ArtworkCard";
import { galleryArtworks } from "@/features/explore/data/galleryArtworks";

export function ExplorePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Explore
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Artist Products
        </h1>
        <p className="mt-3 text-muted-foreground">
          Browse artworks from gallery artists. Visitors can explore freely.
          To purchase a work, please sign up and sign in.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {galleryArtworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </section>
  );
}
