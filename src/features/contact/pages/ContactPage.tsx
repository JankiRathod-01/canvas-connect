import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  contactSchema,
  type ContactFormValues,
} from "@/features/contact/schemas/contactSchema";
import { contactService } from "@/features/contact/services/contactService";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/error";

const SUCCESS_FALLBACK =
  "Thank you. Your message has been sent to the gallery team.";

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    reset({
      name: currentUser?.name ?? "",
      email: currentUser?.email ?? "",
      phone: "",
      subject: searchParams.get("subject") ?? "",
      message: searchParams.get("message") ?? "",
    });
  }, [currentUser, searchParams, reset]);

  const messageLength = watch("message")?.length ?? 0;

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const result = await contactService.submit(values);
      setSuccessMessage(result.message || SUCCESS_FALLBACK);
      reset({
        name: currentUser?.name ?? "",
        email: currentUser?.email ?? "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Get in Touch
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Questions about artworks, exhibitions, or visits? Send a message and
          the gallery team will respond soon.
        </p>

        <div className="mt-8 space-y-4 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Email:</span>{" "}
            ankirathod134@gmail.com
          </p>
          <p>
            <span className="font-medium text-foreground">Phone:</span>{" "}
            7778846493
          </p>
          <p>
            <span className="font-medium text-foreground">Address:</span>{" "}
            Rancharda, Via: Shilaj, Ahmedabad - 382115, Gujarat, India
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Send a message</CardTitle>
          <CardDescription>
            Your inquiry is saved for the gallery team and emailed when mail is
            configured.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            {successMessage ? (
              <Alert>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  <AlertDescription>{successMessage}</AlertDescription>
                </div>
              </Alert>
            ) : null}

            {submitError ? (
              <Alert variant="destructive">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <AlertDescription>{submitError}</AlertDescription>
                </div>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                autoComplete="name"
                placeholder="Your name"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone (optional)</Label>
              <Input
                id="contact-phone"
                type="tel"
                autoComplete="tel"
                placeholder="Your phone number"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
              />
              {errors.phone ? (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-subject">Subject</Label>
              <Input
                id="contact-subject"
                placeholder="What is this about?"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.subject)}
                {...register("subject")}
              />
              {errors.subject ? (
                <p className="text-sm text-destructive">{errors.subject.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="contact-message">Message</Label>
                <span className="text-xs text-muted-foreground">
                  {messageLength}/2000
                </span>
              </div>
              <textarea
                id="contact-message"
                rows={5}
                maxLength={2000}
                disabled={isSubmitting}
                placeholder="How can the gallery help you?"
                aria-invalid={Boolean(errors.message)}
                className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("message")}
              />
              {errors.message ? (
                <p className="text-sm text-destructive">
                  {errors.message.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <LoadingSpinner className="size-4 text-current" label="Sending" />
                  Sending...
                </span>
              ) : (
                "Send message"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
