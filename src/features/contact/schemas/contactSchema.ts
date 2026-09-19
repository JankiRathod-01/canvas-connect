import { z } from "zod";

/**
 * Client-side rules aligned with ContactRequestValidator / Inquiry fields.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .min(2, "Name must be at least 2 characters.")
    .max(150, "Name must be under 150 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(256, "Email must be under 256 characters.")
    .pipe(z.email("Enter a valid email address.")),
  phone: z
    .string()
    .trim()
    .max(30, "Phone must be under 30 characters."),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required.")
    .max(200, "Subject must be under 200 characters."),
  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message must be under 2000 characters."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
