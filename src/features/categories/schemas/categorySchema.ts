import { z } from "zod";

/**
 * Client-side rules aligned with Create/UpdateCategoryRequestValidator on the API.
 */
export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be under 100 characters."),
  description: z
    .string()
    .trim()
    .max(500, "Description must be under 500 characters."),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
