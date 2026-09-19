import { z } from "zod";
import {
  ARTWORK_STATUSES,
  type ArtworkStatusValue,
} from "@/features/artworks/types/artwork";

const currentYear = new Date().getFullYear();

const artworkStatusSchema = z
  .union([z.string(), z.number()])
  .transform((value) => Number(value))
  .refine(
    (value): value is ArtworkStatusValue =>
      value === ARTWORK_STATUSES.available ||
      value === ARTWORK_STATUSES.sold ||
      value === ARTWORK_STATUSES.displayed ||
      value === ARTWORK_STATUSES.archived,
    "Status is invalid.",
  );

/**
 * Client-side rules aligned with Create/UpdateArtworkRequestValidator.
 * Image required only on create (handled in the page/dialog).
 */
export const artworkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be under 200 characters."),
  description: z
    .string()
    .trim()
    .max(4000, "Description must be under 4000 characters."),
  artistId: z.string().uuid("Artist is required."),
  categoryId: z.string().uuid("Category is required."),
  price: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || (!Number.isNaN(Number(value)) && Number(value) >= 0),
      "Price cannot be negative.",
    ),
  yearCreated: z
    .string()
    .trim()
    .refine(
      (value) => {
        if (value === "") {
          return true;
        }
        const year = Number(value);
        return Number.isInteger(year) && year >= 1000 && year <= currentYear + 1;
      },
      `Year created must be between 1000 and ${currentYear + 1}.`,
    ),
  status: artworkStatusSchema,
});

export type ArtworkFormValues = z.output<typeof artworkSchema>;
