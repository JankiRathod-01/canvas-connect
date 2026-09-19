import { z } from "zod";

export const codOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, "Customer name is required.")
    .max(150, "Customer name must be under 150 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(256, "Email must be under 256 characters.")
    .pipe(z.email("Enter a valid email address.")),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required.")
    .max(30, "Phone must be under 30 characters."),
  deliveryAddress: z
    .string()
    .trim()
    .min(10, "Delivery address must be at least 10 characters.")
    .max(500, "Delivery address must be under 500 characters."),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must be under 500 characters."),
  paymentMethod: z.literal("COD"),
});

export type CodOrderFormValues = z.infer<typeof codOrderSchema>;
