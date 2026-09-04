import { z } from "zod";

/**
 * Client-side rules aligned with LoginRequestValidator on the API.
 * Backend accepts email or username in the `email` field.
 */
const emailOrUsernameSchema = z
  .string()
  .trim()
  .min(1, "Email or username is required.")
  .max(256, "Email or username must be under 256 characters.")
  .superRefine((value, context) => {
    if (!value.includes("@")) {
      return;
    }

    const emailResult = z.email().safeParse(value);

    if (!emailResult.success) {
      context.addIssue({
        code: "custom",
        message: "Enter a valid email address.",
      });
    }
  });

export const loginSchema = z.object({
  email: emailOrUsernameSchema,
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
