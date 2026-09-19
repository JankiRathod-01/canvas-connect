import { z } from "zod";

/**
 * Client-side rules aligned with Create/UpdateArtistRequestValidator.
 */
export const artistProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required.")
    .max(150, "Full name must be under 150 characters."),
  biography: z
    .string()
    .trim()
    .max(4000, "Biography must be under 4000 characters."),
  country: z
    .string()
    .trim()
    .max(100, "Country must be under 100 characters."),
  dateOfBirth: z.string().trim(),
  profileImageUrl: z
    .string()
    .trim()
    .max(500, "Profile image URL must be under 500 characters."),
  userId: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || z.string().uuid().safeParse(value).success,
      "Linked user id must be a valid UUID.",
    ),
});

export type ArtistProfileFormValues = z.infer<typeof artistProfileSchema>;
