import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/common/PasswordInput";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { USER_ROLES } from "@/constants/roles";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  signupSchema,
  type SignupFormValues,
} from "@/features/auth/schemas/signupSchema";
import { getErrorMessage } from "@/utils/error";
import { cn } from "@/utils/cn";

const roleOptions = [
  {
    value: USER_ROLES.visitor,
    title: "Visitor",
    description: "Browse artworks and purchase after signing in.",
  },
  {
    value: USER_ROLES.artist,
    title: "Artist",
    description: "Manage your uploads and artist studio.",
  },
] as const;

export function SignupForm() {
  const { signup, isSigningUp } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: USER_ROLES.visitor,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (values: SignupFormValues) => {
    setFormError(null);

    try {
      await signup({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError ? (
        <Alert variant="destructive">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <AlertDescription>{formError}</AlertDescription>
          </div>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Your full name"
          disabled={isSigningUp}
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          disabled={isSigningUp}
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Account type</legend>
        <p className="text-xs text-muted-foreground">
          Admin accounts are created from the backend only.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {roleOptions.map((option) => {
            const isSelected = selectedRole === option.value;

            return (
              <label
                key={option.value}
                className={cn(
                  "cursor-pointer rounded-md border px-3 py-3 text-left transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/40",
                  isSigningUp && "cursor-not-allowed opacity-60",
                )}
              >
                <input
                  type="radio"
                  value={option.value}
                  className="sr-only"
                  disabled={isSigningUp}
                  {...register("role")}
                />
                <p className="text-sm font-medium">{option.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {option.description}
                </p>
              </label>
            );
          })}
        </div>
        {errors.role ? (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        ) : null}
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          disabled={isSigningUp}
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Use upper and lower case letters plus a number.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          disabled={isSigningUp}
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={isSigningUp}>
        {isSigningUp ? (
          <>
            <LoadingSpinner className="size-4 text-primary-foreground" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
