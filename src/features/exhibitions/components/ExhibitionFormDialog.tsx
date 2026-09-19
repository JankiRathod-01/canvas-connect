import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CalendarDays } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LandscapeDialogShell } from "@/components/common/LandscapeDialogShell";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  exhibitionSchema,
  type ExhibitionFormValues,
} from "@/features/exhibitions/schemas/exhibitionSchema";
import type { Exhibition } from "@/features/exhibitions/types/exhibition";
import type { Artwork } from "@/features/artworks/types/artwork";
import { getErrorMessage } from "@/utils/error";

interface ExhibitionFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  exhibition?: Exhibition | null;
  artworks: Artwork[];
  onClose: () => void;
  onSubmit: (values: ExhibitionFormValues) => Promise<void>;
}

function toDateInputValue(value?: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

export function ExhibitionFormDialog({
  open,
  mode,
  exhibition,
  artworks,
  onClose,
  onSubmit,
}: ExhibitionFormDialogProps) {
  const titleId = useId();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExhibitionFormValues>({
    resolver: zodResolver(exhibitionSchema),
    defaultValues: {
      name: "",
      description: "",
      venue: "",
      startDate: "",
      endDate: "",
      artworkIds: [],
    },
  });

  const selectedArtworkIds = watch("artworkIds") ?? [];

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormError(null);
    reset({
      name: exhibition?.name ?? "",
      description: exhibition?.description ?? "",
      venue: exhibition?.venue ?? "",
      startDate: toDateInputValue(exhibition?.startDate),
      endDate: toDateInputValue(exhibition?.endDate),
      artworkIds: exhibition?.artworks.map((item) => item.artworkId) ?? [],
    });
  }, [open, exhibition, reset]);

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

  const title = mode === "create" ? "Add exhibition" : "Edit exhibition";

  const toggleArtwork = (artworkId: string) => {
    const next = selectedArtworkIds.includes(artworkId)
      ? selectedArtworkIds.filter((id) => id !== artworkId)
      : [...selectedArtworkIds, artworkId];
    setValue("artworkIds", next, { shouldValidate: true });
  };

  const submit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  });

  return (
    <LandscapeDialogShell
      open={open}
      titleId={titleId}
      disabled={isSubmitting}
      onClose={onClose}
      wide
      aside={
        <>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-5" />
            <span className="text-xs font-medium uppercase tracking-[0.18em]">
              Artwork assignment
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Select pieces to show in this exhibition ({selectedArtworkIds.length}{" "}
            selected).
          </p>

          {artworks.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No artworks available. Add artworks first, then assign them here.
            </p>
          ) : (
            <div className="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto rounded-lg border border-border bg-card p-2">
              {artworks.map((artwork) => {
                const checked = selectedArtworkIds.includes(artwork.artworkId);
                return (
                  <label
                    key={artwork.artworkId}
                    className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 hover:bg-muted/60"
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={checked}
                      disabled={isSubmitting}
                      onChange={() => toggleArtwork(artwork.artworkId)}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">
                        {artwork.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {artwork.artistName} · {artwork.categoryName}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
          {errors.artworkIds ? (
            <p className="mt-2 text-sm text-destructive">
              {errors.artworkIds.message}
            </p>
          ) : null}
        </>
      }
    >
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit} noValidate>
        <div>
          <h2 id={titleId} className="font-serif text-xl font-semibold sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Schedule and venue details for this show.
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

          <div className="space-y-1.5">
            <Label htmlFor="exhibition-name">Name</Label>
            <Input
              id="exhibition-name"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exhibition-description">Description</Label>
            <textarea
              id="exhibition-description"
              rows={2}
              disabled={isSubmitting}
              className="flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("description")}
            />
            {errors.description ? (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exhibition-venue">Venue</Label>
            <Input
              id="exhibition-venue"
              disabled={isSubmitting}
              placeholder="e.g. Main Gallery Hall"
              {...register("venue")}
            />
            {errors.venue ? (
              <p className="text-sm text-destructive">{errors.venue.message}</p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="exhibition-start">Start date</Label>
              <Input
                id="exhibition-start"
                type="date"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.startDate)}
                {...register("startDate")}
              />
              {errors.startDate ? (
                <p className="text-sm text-destructive">
                  {errors.startDate.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="exhibition-end">End date</Label>
              <Input
                id="exhibition-end"
                type="date"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.endDate)}
                {...register("endDate")}
              />
              {errors.endDate ? (
                <p className="text-sm text-destructive">
                  {errors.endDate.message}
                </p>
              ) : null}
            </div>
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
            ) : mode === "create" ? (
              "Create exhibition"
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </LandscapeDialogShell>
  );
}
