import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ROUTES } from "@/constants/routes";
import { usePublicExhibitions } from "@/features/exhibitions/hooks/usePublicExhibitions";
import {
  EXHIBITION_STATUS_LABELS,
  formatExhibitionRange,
  getExhibitionStatus,
  mapsSearchUrl,
  type ExhibitionScheduleStatus,
} from "@/features/exhibitions/utils/exhibitionSchedule";
import { cn } from "@/utils/cn";

const statusTone: Record<ExhibitionScheduleStatus, string> = {
  active: "bg-emerald-500/15 text-emerald-800",
  upcoming: "bg-sky-500/15 text-sky-900",
  past: "bg-muted text-muted-foreground",
};

export function PublicExhibitionsPage() {
  const { items, search, setSearch, isLoading, error, refresh } =
    usePublicExhibitions();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Visit the gallery
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Exhibitions</h1>
        <p className="mt-3 text-muted-foreground">
          See upcoming and current shows, check the venue, and plan your visit.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or venue..."
          className="max-w-sm"
          aria-label="Search exhibitions"
        />
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading..."
            : `${items.length} exhibition${items.length === 1 ? "" : "s"}`}
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
            <LoadingSpinner label="Loading exhibitions" />
            Loading exhibitions...
          </span>
        </div>
      ) : null}

      {!isLoading && !error && items.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No exhibitions published yet. Check back soon.
        </p>
      ) : null}

      {!isLoading && items.length > 0 ? (
        <div className="mt-8 space-y-4">
          {items.map((exhibition) => {
            const status = getExhibitionStatus(exhibition);
            const venue = exhibition.venue?.trim();

            return (
              <article
                key={exhibition.exhibitionId}
                className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-medium",
                          statusTone[status],
                        )}
                      >
                        {EXHIBITION_STATUS_LABELS[status]}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Palette className="size-3.5" />
                        {exhibition.artworkCount} artwork
                        {exhibition.artworkCount === 1 ? "" : "s"}
                      </span>
                    </div>

                    <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight">
                      {exhibition.name}
                    </h2>

                    <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="size-4 shrink-0" />
                      {formatExhibitionRange(
                        exhibition.startDate,
                        exhibition.endDate,
                      )}
                    </p>

                    {venue ? (
                      <p className="mt-1 inline-flex items-start gap-2 text-sm text-foreground">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <span>{venue}</span>
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Venue to be announced
                      </p>
                    )}

                    {exhibition.description ? (
                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {exhibition.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    {venue ? (
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={mapsSearchUrl(venue)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MapPin className="size-4" />
                          Open in Maps
                        </a>
                      </Button>
                    ) : null}
                    <Button asChild size="sm">
                      <Link
                        to={ROUTES.exhibitionDetail(exhibition.exhibitionId)}
                      >
                        View details
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
