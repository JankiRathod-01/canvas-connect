import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, UserRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LandscapeDialogShell } from "@/components/common/LandscapeDialogShell";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  artistProfileSchema,
  type ArtistProfileFormValues,
} from "@/features/artistProfiles/schemas/artistProfileSchema";
import type { ArtistProfile } from "@/features/artistProfiles/types/artistProfile";
import { getErrorMessage } from "@/utils/error";

interface ArtistProfileFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  artist?: ArtistProfile | null;
  onClose: () => void;
  onSubmit: (values: ArtistProfileFormValues) => Promise<void>;
}

function toDateInput(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

export function ArtistProfileFormDialog({
  open,
  mode,
  artist,
  onClose,
  onSubmit,
}: ArtistProfileFormDialogProps) {
  const titleId = useId();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ArtistProfileFormValues>({
    resolver: zodResolver(artistProfileSchema),
    defaultValues: {
      fullName: "",
      biography: "",
      country: "",
      dateOfBirth: "",
      profileImageUrl: "",
      userId: "",
    },
  });

  const fullName = watch("fullName");
  const country = watch("country");
  const biography = watch("biography");
  const profileImageUrl = watch("profileImageUrl");

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormError(null);
    reset({
      fullName: artist?.fullName ?? "",
      biography: artist?.biography ?? "",
      country: artist?.country ?? "",
      dateOfBirth: toDateInput(artist?.dateOfBirth),
      profileImageUrl: artist?.profileImageUrl ?? "",
      userId: artist?.userId ?? "",
    });
  }, [open, artist, reset]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, isSubmitting, onClose]);

  const title = mode === "create" ? "Add artist profile" : "Edit artist profile";
  const submitLabel = mode === "create" ? "Create profile" : "Save changes";

  const submit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  const imageSrc = profileImageUrl?.trim();

  return (
    <LandscapeDialogShell
      open={open}
      titleId={titleId}
      disabled={isSubmitting}
      onClose={onClose}
      aside={
        <div className="flex h-full flex-col gap-4">
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={fullName?.trim() || "Artist profile"}
                className="size-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <UserRound className="size-10 opacity-60" />
                <span className="text-sm">Profile image preview</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-serif text-2xl font-semibold">
              {fullName?.trim() || "Artist name"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {country?.trim() || "Country not set"}
            </p>
            <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">
              {biography?.trim() ||
                "Biography preview appears here as you type."}
            </p>
            {artist ? (
              <p className="mt-3 text-xs text-muted-foreground">
                {artist.artworkCount} artwork
                {artist.artworkCount === 1 ? "" : "s"} linked
              </p>
            ) : null}
          </div>
        </div>
      }
    >
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit} noValidate>
        <div>
          <h2 id={titleId} className="font-serif text-xl font-semibold sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gallery profile used by artworks and the artist studio.
          </p>
        </div>

        <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto md:pr-1">
          {formError ? (
            <Alert variant="destructive">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <AlertDescription>{formError}</AlertDescription>
              </div>
            </Alert>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="artist-full-name">Full name</Label>
              <Input
                id="artist-full-name"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.fullName)}
                {...register("fullName")}
              />
              {errors.fullName ? (
                <p className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="artist-country">Country</Label>
              <Input
                id="artist-country"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.country)}
                {...register("country")}
              />
              {errors.country ? (
                <p className="text-sm text-destructive">
                  {errors.country.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="artist-dob">Date of birth</Label>
              <Input
                id="artist-dob"
                type="date"
                disabled={isSubmitting}
                {...register("dateOfBirth")}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="artist-bio">Biography</Label>
            <textarea
              id="artist-bio"
              rows={3}
              disabled={isSubmitting}
              className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("biography")}
            />
            {errors.biography ? (
              <p className="text-sm text-destructive">
                {errors.biography.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="artist-image-url">Profile image URL</Label>
            <Input
              id="artist-image-url"
              disabled={isSubmitting}
              placeholder="Optional https://..."
              {...register("profileImageUrl")}
            />
            {errors.profileImageUrl ? (
              <p className="text-sm text-destructive">
                {errors.profileImageUrl.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="artist-user-id">Linked login user id</Label>
            <Input
              id="artist-user-id"
              disabled={isSubmitting}
              placeholder="Optional AspNetUsers Id (UUID)"
              {...register("userId")}
            />
            {errors.userId ? (
              <p className="text-sm text-destructive">{errors.userId.message}</p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Links this profile to an Artist account for studio access.
            </p>
          </div>
        </div>

        <div className="mt-4 flex shrink-0 flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <LoadingSpinner className="size-4 text-current" label="Saving" />
                Saving...
              </span>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </LandscapeDialogShell>
  );
}
