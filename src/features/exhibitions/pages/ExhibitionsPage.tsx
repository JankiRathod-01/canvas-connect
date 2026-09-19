import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { artworkService } from "@/features/artworks/services/artworkService";
import type { Artwork } from "@/features/artworks/types/artwork";
import { ExhibitionFormDialog } from "@/features/exhibitions/components/ExhibitionFormDialog";
import { ExhibitionsTable } from "@/features/exhibitions/components/ExhibitionsTable";
import { useExhibitions } from "@/features/exhibitions/hooks/useExhibitions";
import type { ExhibitionFormValues } from "@/features/exhibitions/schemas/exhibitionSchema";
import { exhibitionService } from "@/features/exhibitions/services/exhibitionService";
import type { Exhibition } from "@/features/exhibitions/types/exhibition";
import { getErrorMessage } from "@/utils/error";

export function ExhibitionsPage() {
  const { items, search, setSearch, isLoading, error, refresh } = useExhibitions();

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [lookupsError, setLookupsError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Exhibition | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Exhibition | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const list = await artworkService.getAll();
        setArtworks(list);
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

  const openEdit = async (exhibition: Exhibition) => {
    setActionError(null);
    setFormMode("edit");

    try {
      const detail = await exhibitionService.getById(exhibition.exhibitionId);
      setSelected(detail);
      setFormOpen(true);
    } catch (loadError) {
      setActionError(getErrorMessage(loadError));
    }
  };

  const handleSubmit = async (values: ExhibitionFormValues) => {
    const payload = {
      name: values.name,
      description: values.description || null,
      venue: values.venue || null,
      startDate: values.startDate,
      endDate: values.endDate,
      artworkIds: values.artworkIds,
    };

    if (formMode === "create") {
      await exhibitionService.create(payload);
    } else if (selected) {
      await exhibitionService.update(selected.exhibitionId, payload);
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
      await exhibitionService.remove(deleteTarget.exhibitionId);
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
        eyebrow="Exhibition management"
        title="Exhibitions"
        description="Create exhibitions and assign artworks for the gallery schedule."
        actions={
          <Button type="button" onClick={openCreate}>
            <Plus className="size-4" />
            Add exhibition
          </Button>
        }
      />

      {lookupsError ? (
        <p className="text-sm text-destructive">{lookupsError}</p>
      ) : null}

      {actionError ? (
        <p className="text-sm text-destructive">{actionError}</p>
      ) : null}

      <ExhibitionsTable
        items={items}
        isLoading={isLoading}
        error={error}
        search={search}
        onSearchChange={setSearch}
        onRetry={refresh}
        onEdit={(exhibition) => {
          void openEdit(exhibition);
        }}
        onDelete={setDeleteTarget}
      />

      <ExhibitionFormDialog
        open={formOpen}
        mode={formMode}
        exhibition={selected}
        artworks={artworks}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete exhibition?"
        description={
          deleteTarget
            ? `Delete “${deleteTarget.name}”? Artwork links for this exhibition will also be removed.`
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
