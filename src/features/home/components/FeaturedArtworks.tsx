import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SafeImage } from "@/components/common/SafeImage";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { exploreService } from "@/features/explore/services/exploreService";
import type { GalleryArtwork } from "@/features/explore/types/galleryArtwork";

export function FeaturedArtworks() {
  const [items, setItems] = useState<GalleryArtwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const artworks = await exploreService.getArtworks();
        setItems(artworks.slice(0, 4));
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <section
      id="featured"
      className="scroll-mt-20 border-t border-border bg-card/60 py-14"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Collection
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Featured Artworks
            </h2>
            <p className="mt-2 text-muted-foreground">
              A small selection from the live gallery. Browse Explore to see all
              artist products.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to={ROUTES.explore}>View all artworks</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-10 flex justify-center">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <LoadingSpinner label="Loading featured artworks" />
              Loading featured works...
            </span>
          </div>
        ) : null}

        {!isLoading && items.length === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">
            No artworks published yet. Check back soon.
          </p>
        ) : null}

        {!isLoading && items.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {items.map((artwork) => (
              <Card key={artwork.id} className="overflow-hidden shadow-sm">
                <SafeImage
                  src={artwork.image}
                  alt={artwork.title}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
                <CardHeader className="p-4 pb-1">
                  <CardTitle className="text-xl">{artwork.title}</CardTitle>
                  <CardDescription>{artwork.artistName}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {artwork.category}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
