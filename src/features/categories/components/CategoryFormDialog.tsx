import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Tags } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LandscapeDialogShell } from "@/components/common/LandscapeDialogShell";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/features/categories/schemas/categorySchema";
import type { Category } from "@/features/categories/types/category";
import { getErrorMessage } from "@/utils/error";

interface CategoryFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  category?: Category | null;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
}

export function CategoryFormDialog({
  open,
  mode,
  category,
  onClose,
  onSubmit,
}: CategoryFormDialogProps) {
  const titleId = useId();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const namePreview = watch("name");
  const descriptionPreview = watch("description");

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormError(null);
    reset({
      name: category?.name ?? "",
      description: category?.description ?? "",
    });
  }, [open, category, reset]);

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

  const title = mode === "create" ? "Add category" : "Edit category";
  const submitLabel = mode === "create" ? "Create category" : "Save changes";

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
      aside={
        <div className="flex h-full flex-col justify-between gap-6">
          <div>
            <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card">
              <Tags className="size-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-serif text-2xl font-semibold">
              {namePreview?.trim() || "Category preview"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {descriptionPreview?.trim() ||
                "Categories group artworks for browsing and admin filters."}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Used on Explore filters, artwork forms, and gallery reports.
          </p>
        </div>
      }
    >
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit} noValidate>
        <div>
          <h2 id={titleId} className="font-serif text-xl font-semibold sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Name and optional short description.
          </p>
        </div>

        <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto">
          {formError ? (
            <Alert variant="destructive">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <AlertDescription>{formError}</AlertDescription>
              </div>
            </Alert>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              placeholder="e.g. Painting"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category-description">Description</Label>
            <textarea
              id="category-description"
              rows={5}
              disabled={isSubmitting}
              placeholder="Optional short description"
              aria-invalid={Boolean(errors.description)}
              className="flex min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("description")}
            />
            {errors.description ? (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            ) : null}
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
