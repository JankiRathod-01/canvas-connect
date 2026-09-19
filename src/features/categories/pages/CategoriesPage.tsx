import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { CategoriesTable } from "@/features/categories/components/CategoriesTable";
import { CategoryFormDialog } from "@/features/categories/components/CategoryFormDialog";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { categoryService } from "@/features/categories/services/categoryService";
import type { CategoryFormValues } from "@/features/categories/schemas/categorySchema";
import type { Category } from "@/features/categories/types/category";
import { getErrorMessage } from "@/utils/error";

export function CategoriesPage() {
  const { items, search, setSearch, isLoading, error, refresh } = useCategories();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Category | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const openCreate = () => {
    setActionError(null);
    setFormMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setActionError(null);
    setFormMode("edit");
    setSelected(category);
    setFormOpen(true);
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    const payload = {
      name: values.name,
      description: values.description || null,
    };

    if (formMode === "create") {
      await categoryService.create(payload);
    } else if (selected) {
      await categoryService.update(selected.categoryId, payload);
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
      await categoryService.remove(deleteTarget.categoryId);
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
        eyebrow="Category management"
        title="Categories"
        description="Create and maintain artwork categories used across the gallery."
        actions={
          <Button type="button" onClick={openCreate}>
            <Plus className="size-4" />
            Add category
          </Button>
        }
      />

      {actionError ? (
        <p className="text-sm text-destructive">{actionError}</p>
      ) : null}

      <CategoriesTable
        items={items}
        isLoading={isLoading}
        error={error}
        search={search}
        onSearchChange={setSearch}
        onRetry={refresh}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <CategoryFormDialog
        open={formOpen}
        mode={formMode}
        category={selected}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category?"
        description={
          deleteTarget
            ? `Delete “${deleteTarget.name}”? This cannot be undone.`
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
