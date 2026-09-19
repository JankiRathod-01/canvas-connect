import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { ArtworksTable } from "@/features/artworks/components/ArtworksTable";
import { ArtworkFormDialog } from "@/features/artworks/components/ArtworkFormDialog";
import { useArtworks } from "@/features/artworks/hooks/useArtworks";
import { artworkService } from "@/features/artworks/services/artworkService";
import type { ArtworkFormValues } from "@/features/artworks/schemas/artworkSchema";
import type {
  ArtistOption,
  Artwork,
  ArtworkStatusValue,
} from "@/features/artworks/types/artwork";
import { categoryService } from "@/features/categories/services/categoryService";
import type { Category } from "@/features/categories/types/category";
import { getErrorMessage } from "@/utils/error";

export function ArtworksPage() {
  const { items, search, setSearch, isLoading, error, refresh } = useArtworks();

  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lookupsError, setLookupsError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Artwork | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Artwork | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [artistList, categoryList] = await Promise.all([
          artworkService.getArtists(),
          categoryService.getAll(),
        ]);
        setArtists(artistList);
        setCategories(categoryList);
        setLookupsError(null);
      } catch (loadError) {
        setLookupsError(getErrorMessage(loadError));
      }
    })();
  }, []);

  const openCreate = () => {
    setActionError(null);
    setFormMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (artwork: Artwork) => {
    setActionError(null);
    setFormMode("edit");
    setSelected(artwork);
    setFormOpen(true);
  };

  const handleSubmit = async (values: ArtworkFormValues, image: File | null) => {
    const payload = {
      title: values.title,
      description: values.description || null,
      artistId: values.artistId,
      categoryId: values.categoryId,
      price: values.price.trim() === "" ? null : Number(values.price),
      yearCreated:
        values.yearCreated.trim() === "" ? null : Number(values.yearCreated),
      status: values.status as ArtworkStatusValue,
      image,
    };

    if (formMode === "create") {
      await artworkService.create(payload);
    } else if (selected) {
      await artworkService.update(selected.artworkId, payload);
    }

    refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setActionError(null);

    try {
      await artworkService.remove(deleteTarget.artworkId);
      setDeleteTarget(null);
      refresh();
    } catch (deleteError) {
      setActionError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Artwork management"
        title="Artworks"
        description="Upload and manage gallery artworks. Images are stored in SQL Server as VARBINARY."
        actions={
          <Button
            type="button"
            onClick={openCreate}
            disabled={artists.length === 0 || categories.length === 0}
          >
            <Plus className="size-4" />
            Add artwork
          </Button>
        }
      />

      {lookupsError ? (
        <p className="text-sm text-destructive">{lookupsError}</p>
      ) : null}

      {artists.length === 0 || categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Add at least one category and ensure artists exist before creating
          artworks.
        </p>
      ) : null}

      {actionError ? (
        <p className="text-sm text-destructive">{actionError}</p>
      ) : null}

      <ArtworksTable
        items={items}
        isLoading={isLoading}
        error={error}
        search={search}
        onSearchChange={setSearch}
        onRetry={refresh}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <ArtworkFormDialog
        open={formOpen}
        mode={formMode}
        artwork={selected}
        artists={artists}
        categories={categories}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete artwork?"
        description={
          deleteTarget
            ? `Delete “${deleteTarget.title}”? The stored image will also be removed.`
            : ""
        }
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={() => {
          void handleDelete();
        }}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteTarget(null);
          }
        }}
      />
    </div>
  );
}
