import { z } from "zod";

const emailOrUsernameSchema = z
  .string()
  .trim()
  .min(1, "Email or username is required")
  .superRefine((value, context) => {
    if (value.includes("@")) {
      const emailResult = z.email().safeParse(value);

      if (!emailResult.success) {
        context.addIssue({
          code: "custom",
          message: "Enter a valid email address",
        });
      }

      return;
    }

    if (value.length < 3) {
      context.addIssue({
        code: "custom",
        message: "Username must be at least 3 characters",
      });
    }
  });

export const loginSchema = z.object({
  email: emailOrUsernameSchema,
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
