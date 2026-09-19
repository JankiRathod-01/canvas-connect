import { ArtworkCard } from "@/features/explore/components/ArtworkCard";
import { useExploreGallery } from "@/features/explore/hooks/useExploreGallery";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function ExplorePage() {
  const {
    items,
    categories,
    artists,
    search,
    setSearch,
    categoryId,
    setCategoryId,
    artistId,
    setArtistId,
    isLoading,
    error,
    refresh,
  } = useExploreGallery();

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
          Browse artworks and place a Cash on Delivery (COD) order — no online
          payment. You can also inquire with the gallery team.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search title, artist, category..."
          aria-label="Search artworks"
        />
        <select
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={artistId}
          onChange={(event) => setArtistId(event.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-label="Filter by artist"
        >
          <option value="">All artists</option>
          {artists.map((artist) => (
            <option key={artist.artistId} value={artist.artistId}>
              {artist.fullName}
            </option>
          ))}
        </select>
        <p className="flex items-center text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${items.length} artwork${items.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {error ? (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>{error}</span>
            <Button type="button" size="sm" variant="outline" onClick={refresh}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="mt-16 flex justify-center">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <LoadingSpinner label="Loading gallery" />
            Loading gallery...
          </span>
        </div>
      ) : null}

      {!isLoading && !error && items.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No artworks match your filters yet.
        </p>
      ) : null}

      {!isLoading && items.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
