import { z } from "zod";

/**
 * Client-side rules aligned with ContactRequestValidator on the API.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be under 80 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(256, "Email must be under 256 characters.")
    .pipe(z.email("Enter a valid email address.")),
  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .min(10, "Message must be at least 10 characters.")
    .max(500, "Message must be under 500 characters."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
