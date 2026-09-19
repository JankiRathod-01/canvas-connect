import { useEffect, useId, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ImagePlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LandscapeDialogShell } from "@/components/common/LandscapeDialogShell";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ArtworkImage } from "@/features/artworks/components/ArtworkImage";
import {
  artworkSchema,
  type ArtworkFormValues,
} from "@/features/artworks/schemas/artworkSchema";
import {
  ARTWORK_STATUS_LABELS,
  ARTWORK_STATUSES,
  type ArtistOption,
  type Artwork,
} from "@/features/artworks/types/artwork";
import type { Category } from "@/features/categories/types/category";
import { getErrorMessage } from "@/utils/error";

interface ArtworkFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  artwork?: Artwork | null;
  artists: ArtistOption[];
  categories: Category[];
  lockArtist?: boolean;
  onClose: () => void;
  onSubmit: (values: ArtworkFormValues, image: File | null) => Promise<void>;
}

export function ArtworkFormDialog({
  open,
  mode,
  artwork,
  artists,
  categories,
  lockArtist = false,
  onClose,
  onSubmit,
}: ArtworkFormDialogProps) {
  const titleId = useId();
  const [formError, setFormError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkSchema) as Resolver<ArtworkFormValues>,
    defaultValues: {
      title: "",
      description: "",
      artistId: "",
      categoryId: "",
      price: "",
      yearCreated: "",
      status: ARTWORK_STATUSES.available,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormError(null);
    setImageError(null);
    setImageFile(null);
    setImagePreview(null);

    reset({
      title: artwork?.title ?? "",
      description: artwork?.description ?? "",
      artistId: artwork?.artistId ?? artists[0]?.artistId ?? "",
      categoryId: artwork?.categoryId ?? categories[0]?.categoryId ?? "",
      price: artwork?.price != null ? String(artwork.price) : "",
      yearCreated: artwork?.yearCreated != null ? String(artwork.yearCreated) : "",
      status: artwork?.status ?? ARTWORK_STATUSES.available,
    });
  }, [open, artwork, artists, categories, reset]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

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

  const title = mode === "create" ? "Add artwork" : "Edit artwork";
  const showExistingImage =
    !imagePreview && mode === "edit" && Boolean(artwork?.hasImage);

  const submit = handleSubmit(async (values) => {
    setFormError(null);
    setImageError(null);

    if (mode === "create" && !imageFile) {
      setImageError("Artwork image is required.");
      return;
    }

    try {
      await onSubmit(values, imageFile);
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
      aside={
        <>
          <Label htmlFor="artwork-image">
            Image {mode === "create" ? "(required)" : "(optional)"}
          </Label>

          <div className="mt-2 flex min-h-0 flex-1 flex-col gap-3">
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="New artwork preview"
                  className="size-full object-contain"
                />
              ) : showExistingImage && artwork ? (
                <ArtworkImage
                  artworkId={artwork.artworkId}
                  alt={artwork.title}
                  className="size-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground">
                  <ImagePlus className="size-8 opacity-60" />
                  <span>Preview appears here after you choose a file</span>
                </div>
              )}
            </div>

            <Input
              id="artwork-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={isSubmitting}
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setImageFile(file);
                setImageError(null);
              }}
            />
            {imageError ? (
              <p className="text-sm text-destructive">{imageError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP, or GIF · max 5 MB
                {mode === "edit" ? " · leave empty to keep current" : ""}
              </p>
            )}
          </div>
        </>
      }
    >
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit} noValidate>
        <div>
          <h2 id={titleId} className="font-serif text-xl font-semibold sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Details and pricing for this gallery piece.
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
            <Label htmlFor="artwork-title">Title</Label>
            <Input
              id="artwork-title"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.title)}
              {...register("title")}
            />
            {errors.title ? (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="artwork-description">Description</Label>
            <textarea
              id="artwork-description"
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

          <div className={`grid gap-3 ${lockArtist ? "" : "sm:grid-cols-2"}`}>
            {lockArtist ? (
              <input type="hidden" {...register("artistId")} />
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="artwork-artist">Artist</Label>
                <select
                  id="artwork-artist"
                  disabled={isSubmitting || artists.length === 0}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  aria-invalid={Boolean(errors.artistId)}
                  {...register("artistId")}
                >
                  <option value="">Select artist</option>
                  {artists.map((artist) => (
                    <option key={artist.artistId} value={artist.artistId}>
                      {artist.fullName}
                    </option>
                  ))}
                </select>
                {errors.artistId ? (
                  <p className="text-sm text-destructive">
                    {errors.artistId.message}
                  </p>
                ) : null}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="artwork-category">Category</Label>
              <select
                id="artwork-category"
                disabled={isSubmitting || categories.length === 0}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                aria-invalid={Boolean(errors.categoryId)}
                {...register("categoryId")}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId ? (
                <p className="text-sm text-destructive">
                  {errors.categoryId.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="artwork-price">Price</Label>
              <Input
                id="artwork-price"
                type="number"
                min={0}
                step="0.01"
                disabled={isSubmitting}
                {...register("price")}
              />
              {errors.price ? (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="artwork-year">Year</Label>
              <Input
                id="artwork-year"
                type="number"
                disabled={isSubmitting}
                {...register("yearCreated")}
              />
              {errors.yearCreated ? (
                <p className="text-sm text-destructive">
                  {errors.yearCreated.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="artwork-status">Status</Label>
              <select
                id="artwork-status"
                disabled={isSubmitting}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                {...register("status")}
              >
                {Object.entries(ARTWORK_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
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
              "Create artwork"
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </LandscapeDialogShell>
  );
}
