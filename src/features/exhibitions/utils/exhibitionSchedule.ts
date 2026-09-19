import type { Exhibition } from "@/features/exhibitions/types/exhibition";

export type ExhibitionScheduleStatus = "upcoming" | "active" | "past";

function startOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export function getExhibitionStatus(
  exhibition: Pick<Exhibition, "startDate" | "endDate">,
  now = new Date(),
): ExhibitionScheduleStatus {
  const today = startOfDay(now);
  const start = startOfDay(new Date(exhibition.startDate));
  const end = startOfDay(new Date(exhibition.endDate));

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "upcoming";
  }

  if (today < start) {
    return "upcoming";
  }

  if (today > end) {
    return "past";
  }

  return "active";
}

export const EXHIBITION_STATUS_LABELS: Record<ExhibitionScheduleStatus, string> = {
  upcoming: "Upcoming",
  active: "Now showing",
  past: "Past",
};

export function formatExhibitionDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatExhibitionRange(startDate: string, endDate: string): string {
  return `${formatExhibitionDate(startDate)} – ${formatExhibitionDate(endDate)}`;
}

/** Google Maps search URL so visitors can navigate to the venue. */
export function mapsSearchUrl(venue: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.trim())}`;
}
