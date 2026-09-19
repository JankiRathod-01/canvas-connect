import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, Palette } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ArtworkImage } from "@/features/artworks/components/ArtworkImage";
import { ROUTES } from "@/constants/routes";
import { exhibitionService } from "@/features/exhibitions/services/exhibitionService";
import type { Exhibition } from "@/features/exhibitions/types/exhibition";
import {
  EXHIBITION_STATUS_LABELS,
  formatExhibitionRange,
  getExhibitionStatus,
  mapsSearchUrl,
} from "@/features/exhibitions/utils/exhibitionSchedule";
import { cn } from "@/utils/cn";
import { getErrorMessage } from "@/utils/error";

const statusTone = {
  active: "bg-emerald-500/15 text-emerald-800",
  upcoming: "bg-sky-500/15 text-sky-900",
  past: "bg-muted text-muted-foreground",
} as const;

export function PublicExhibitionDetailPage() {
  const { exhibitionId = "" } = useParams();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!exhibitionId) {
      setError("Exhibition not found.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const detail = await exhibitionService.getById(exhibitionId);
        if (!cancelled) {
          setExhibition(detail);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(getErrorMessage(loadError));
          setExhibition(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [exhibitionId]);

  if (isLoading) {
    return (
      <div className="flex justify-center px-4 py-24">
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <LoadingSpinner label="Loading exhibition" />
          Loading exhibition...
        </span>
      </div>
    );
  }

  if (error || !exhibition) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-16 sm:px-6">
        <Alert variant="destructive">
          <AlertDescription>{error ?? "Exhibition not found."}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to={ROUTES.exhibitions}>
            <ArrowLeft className="size-4" />
            Back to exhibitions
          </Link>
        </Button>
      </div>
    );
  }

  const status = getExhibitionStatus(exhibition);
  const venue = exhibition.venue?.trim();

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <Button asChild variant="ghost" className="mb-6 -ml-2">
        <Link to={ROUTES.exhibitions}>
          <ArrowLeft className="size-4" />
          All exhibitions
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-xs font-medium",
              statusTone[status],
            )}
          >
            {EXHIBITION_STATUS_LABELS[status]}
          </span>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight">
            {exhibition.name}
          </h1>
          {exhibition.description ? (
            <p className="mt-4 max-w-2xl text-muted-foreground">
              {exhibition.description}
            </p>
          ) : null}

          <dl className="mt-8 space-y-4 rounded-xl border border-border bg-card p-5">
            <div className="flex gap-3">
              <CalendarDays className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Dates
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  {formatExhibitionRange(
                    exhibition.startDate,
                    exhibition.endDate,
                  )}
                </dd>
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Venue / location
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  {venue || "Venue to be announced"}
                </dd>
                {venue ? (
                  <Button asChild size="sm" className="mt-3">
                    <a
                      href={mapsSearchUrl(venue)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MapPin className="size-4" />
                      Get directions
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="flex gap-3">
              <Palette className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Featured works
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  {exhibition.artworks.length} artwork
                  {exhibition.artworks.length === 1 ? "" : "s"}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-semibold">On display</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Artworks assigned to this exhibition.
          </p>

          {exhibition.artworks.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Artwork list will appear once the gallery assigns pieces.
            </p>
          ) : (
            <ul className="mt-6 space-y-3">
              {exhibition.artworks.map((artwork) => (
                <li
                  key={artwork.artworkId}
                  className="flex gap-3 rounded-xl border border-border bg-card p-3"
                >
                  {artwork.hasImage ? (
                    <ArtworkImage
                      artworkId={artwork.artworkId}
                      alt={artwork.title}
                      className="size-16 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground">
                      No img
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium">{artwork.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {artwork.artistName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {artwork.categoryName}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Button asChild variant="outline" className="mt-6 w-full sm:w-auto">
            <Link to={ROUTES.explore}>Browse full Explore gallery</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
