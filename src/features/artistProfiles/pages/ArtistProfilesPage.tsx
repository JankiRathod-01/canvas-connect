import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { ArtistProfileFormDialog } from "@/features/artistProfiles/components/ArtistProfileFormDialog";
import { ArtistProfilesTable } from "@/features/artistProfiles/components/ArtistProfilesTable";
import { useArtistProfiles } from "@/features/artistProfiles/hooks/useArtistProfiles";
import type { ArtistProfileFormValues } from "@/features/artistProfiles/schemas/artistProfileSchema";
import { artistProfileService } from "@/features/artistProfiles/services/artistProfileService";
import type { ArtistProfile } from "@/features/artistProfiles/types/artistProfile";
import { getErrorMessage } from "@/utils/error";

export function ArtistProfilesPage() {
  const { items, search, setSearch, isLoading, error, refresh } =
    useArtistProfiles();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<ArtistProfile | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ArtistProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const openCreate = () => {
    setActionError(null);
    setFormMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (artist: ArtistProfile) => {
    setActionError(null);
    setFormMode("edit");
    setSelected(artist);
    setFormOpen(true);
  };

  const handleSubmit = async (values: ArtistProfileFormValues) => {
    const payload = {
      fullName: values.fullName,
      biography: values.biography || null,
      country: values.country || null,
      dateOfBirth: values.dateOfBirth || null,
      profileImageUrl: values.profileImageUrl || null,
      userId: values.userId || null,
    };

    if (formMode === "create") {
      await artistProfileService.create(payload);
    } else if (selected) {
      await artistProfileService.update(selected.artistId, payload);
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
      await artistProfileService.remove(deleteTarget.artistId);
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
        eyebrow="Artist management"
        title="Artist profiles"
        description="Gallery artist profiles used by artworks and the artist studio."
        actions={
          <Button type="button" onClick={openCreate}>
            <Plus className="size-4" />
            Add profile
          </Button>
        }
      />

      {actionError ? (
        <p className="text-sm text-destructive">{actionError}</p>
      ) : null}

      <ArtistProfilesTable
        items={items}
        isLoading={isLoading}
        error={error}
        search={search}
        onSearchChange={setSearch}
        onRetry={refresh}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <ArtistProfileFormDialog
        open={formOpen}
        mode={formMode}
        artist={selected}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete artist profile?"
        description={
          deleteTarget
            ? `Delete “${deleteTarget.fullName}”? Profiles with artworks cannot be deleted.`
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
