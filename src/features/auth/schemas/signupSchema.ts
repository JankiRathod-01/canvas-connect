import { z } from "zod";
import { REGISTERABLE_ROLES } from "@/features/auth/constants/registerableRoles";

/**
 * Client-side rules aligned with RegisterRequestValidator on the API.
 */
const passwordSchema = z
  .string()
  .min(1, "Password is required.")
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
  .regex(/[a-z]/, "Password must include at least one lowercase letter.")
  .regex(/[0-9]/, "Password must include at least one number.");

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Full name is required.")
      .min(2, "Full name must be at least 2 characters.")
      .max(80, "Full name must be under 80 characters."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .max(256, "Email must be under 256 characters.")
      .pipe(z.email("Enter a valid email address.")),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password."),
    role: z.enum(REGISTERABLE_ROLES, {
      message: "Only Visitor and Artist accounts can be created here.",
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
