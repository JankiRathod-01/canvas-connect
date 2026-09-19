import { z } from "zod";

/**
 * Client-side rules aligned with Create/UpdateExhibitionRequestValidator.
 */
export const exhibitionSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .max(200, "Name must be under 200 characters."),
    description: z
      .string()
      .trim()
      .max(4000, "Description must be under 4000 characters."),
    venue: z
      .string()
      .trim()
      .max(200, "Venue must be under 200 characters."),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().min(1, "End date is required."),
    artworkIds: z.array(z.string().uuid()),
  })
  .refine((values) => values.endDate >= values.startDate, {
    message: "End date must be on or after the start date.",
    path: ["endDate"],
  });

export type ExhibitionFormValues = z.infer<typeof exhibitionSchema>;
