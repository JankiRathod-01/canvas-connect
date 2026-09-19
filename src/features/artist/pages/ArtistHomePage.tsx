import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ImagePlus, Package, Palette, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { ArtworkFormDialog } from "@/features/artworks/components/ArtworkFormDialog";
import { ArtworkImage } from "@/features/artworks/components/ArtworkImage";
import type { ArtworkFormValues } from "@/features/artworks/schemas/artworkSchema";
import {
  ARTWORK_STATUS_LABELS,
  ARTWORK_STATUSES,
  type Artwork,
  type ArtworkStatusValue,
} from "@/features/artworks/types/artwork";
import { useStudioArtworks } from "@/features/artist/hooks/useStudioArtworks";
import { studioArtworkService } from "@/features/artist/services/studioArtworkService";
import { artistProfileService } from "@/features/artistProfiles/services/artistProfileService";
import type { ArtistProfile } from "@/features/artistProfiles/types/artistProfile";
import { categoryService } from "@/features/categories/services/categoryService";
import type { Category } from "@/features/categories/types/category";
import { formatPrice } from "@/features/explore/services/exploreService";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { getErrorMessage } from "@/utils/error";

type StudioTab = "overview" | "products";
type StatusFilter = "all" | ArtworkStatusValue;

const STATUS_TABS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: ARTWORK_STATUSES.available, label: ARTWORK_STATUS_LABELS[ARTWORK_STATUSES.available] },
  { id: ARTWORK_STATUSES.displayed, label: ARTWORK_STATUS_LABELS[ARTWORK_STATUSES.displayed] },
  { id: ARTWORK_STATUSES.sold, label: ARTWORK_STATUS_LABELS[ARTWORK_STATUSES.sold] },
  { id: ARTWORK_STATUSES.archived, label: ARTWORK_STATUS_LABELS[ARTWORK_STATUSES.archived] },
];

export function ArtistHomePage() {
  const { currentUser } = useAuth();
  const { items, search, setSearch, isLoading, error, refresh } =
    useStudioArtworks();

  const [studioTab, setStudioTab] = useState<StudioTab>("products");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Artwork | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Artwork | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const [mine, categoryList] = await Promise.all([
          artistProfileService.getMine(),
          categoryService.getAll(),
        ]);
        setProfile(mine);
        setCategories(categoryList);
        setProfileError(null);
      } catch (loadError) {
        setProfileError(getErrorMessage(loadError));
      }
    })();
  }, []);

  const totalValue = items.reduce(
    (sum, artwork) => sum + (artwork.price ?? 0),
    0,
  );

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      all: items.length,
      [ARTWORK_STATUSES.available]: 0,
      [ARTWORK_STATUSES.sold]: 0,
      [ARTWORK_STATUSES.displayed]: 0,
      [ARTWORK_STATUSES.archived]: 0,
    };

    for (const artwork of items) {
      counts[artwork.status] += 1;
    }

    return counts;
  }, [items]);

  const filteredItems = useMemo(() => {
    if (statusFilter === "all") {
      return items;
    }
    return items.filter((artwork) => artwork.status === statusFilter);
  }, [items, statusFilter]);

  const openCreate = () => {
    setActionError(null);
    setStudioTab("products");
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
    if (!profile) {
      throw new Error("Artist profile not found. Contact the gallery admin.");
    }

    const payload = {
      title: values.title,
      description: values.description || null,
      artistId: profile.artistId,
      categoryId: values.categoryId,
      price: values.price.trim() === "" ? null : Number(values.price),
      yearCreated:
        values.yearCreated.trim() === "" ? null : Number(values.yearCreated),
      status: values.status as ArtworkStatusValue,
      image,
    };

    if (formMode === "create") {
      await studioArtworkService.create(payload);
    } else if (selected) {
      await studioArtworkService.update(selected.artworkId, payload);
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
      await studioArtworkService.remove(deleteTarget.artworkId);
      setDeleteTarget(null);
      refresh();
    } catch (deleteError) {
      setActionError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  const mainTabClass = (tab: StudioTab) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      studioTab === tab
        ? "bg-primary/10 text-foreground"
        : "text-muted-foreground hover:text-foreground",
    );

  const statusTabClass = (tab: StatusFilter) =>
    cn(
      "rounded-md px-3 py-1.5 text-sm transition-colors",
      statusFilter === tab
        ? "bg-foreground text-background"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
    );

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Artist studio
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome, {currentUser?.name ?? "Artist"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            {profile
              ? `${profile.fullName}${profile.country ? ` · ${profile.country}` : ""}`
              : "Manage your gallery uploads from one place."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to={ROUTES.explore}>Public gallery</Link>
          </Button>
          <Button
            type="button"
            disabled={!profile || categories.length === 0}
            onClick={openCreate}
          >
            <ImagePlus className="size-4" />
            Add artwork
          </Button>
        </div>
      </section>

      {profileError ? (
        <Alert variant="destructive">
          <AlertDescription>{profileError}</AlertDescription>
        </Alert>
      ) : null}

      {actionError ? (
        <p className="text-sm text-destructive">{actionError}</p>
      ) : null}

      <nav
        className="flex flex-wrap gap-1 border-b border-border pb-3"
        aria-label="Studio sections"
      >
        <button
          type="button"
          className={mainTabClass("overview")}
          onClick={() => setStudioTab("overview")}
        >
          Overview
        </button>
        <button
          type="button"
          className={mainTabClass("products")}
          onClick={() => setStudioTab("products")}
        >
          My products
          <span className="ml-1.5 text-xs text-muted-foreground">
            ({items.length})
          </span>
        </button>
      </nav>

      {studioTab === "overview" ? (
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Artworks</p>
            <p className="mt-2 flex items-center gap-2 text-3xl font-semibold">
              <Palette className="size-5 text-muted-foreground" />
              {items.length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Collection value</p>
            <p className="mt-2 flex items-center gap-2 text-3xl font-semibold">
              <Package className="size-5 text-muted-foreground" />
              {formatPrice(totalValue)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Available now</p>
            <p className="mt-2 text-3xl font-semibold">
              {statusCounts[ARTWORK_STATUSES.available]}
            </p>
            <Button
              type="button"
              variant="link"
              className="mt-2 h-auto px-0"
              onClick={() => {
                setStatusFilter(ARTWORK_STATUSES.available);
                setStudioTab("products");
              }}
            >
              View available
            </Button>
          </div>
        </section>
      ) : null}

      {studioTab === "products" ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div
              className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/30 p-1"
              role="tablist"
              aria-label="Filter by status"
            >
              {STATUS_TABS.map((tab) => (
                <button
                  key={String(tab.id)}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === tab.id}
                  className={statusTabClass(tab.id)}
                  onClick={() => setStatusFilter(tab.id)}
                >
                  {tab.label}
                  <span className="ml-1 opacity-70">
                    ({statusCounts[tab.id]})
                  </span>
                </button>
              ))}
            </div>

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title or category..."
              className="max-w-sm"
              aria-label="Search my artworks"
            />
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
                <span>{error}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={refresh}
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Artwork</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      <span className="inline-flex items-center gap-2">
                        <LoadingSpinner label="Loading studio artworks" />
                        Loading your artworks...
                      </span>
                    </td>
                  </tr>
                ) : null}

                {!isLoading && filteredItems.length === 0 && !error ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      {items.length === 0
                        ? "No artworks yet. Add your first piece to appear on Explore."
                        : "No artworks in this status."}
                    </td>
                  </tr>
                ) : null}

                {!isLoading
                  ? filteredItems.map((artwork) => (
                      <tr
                        key={artwork.artworkId}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {artwork.hasImage ? (
                              <ArtworkImage
                                artworkId={artwork.artworkId}
                                alt={artwork.title}
                                className="size-12 shrink-0 rounded-md object-cover"
                              />
                            ) : (
                              <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground">
                                No img
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-medium text-foreground">
                                {artwork.title}
                              </p>
                              {artwork.yearCreated ? (
                                <p className="text-xs text-muted-foreground">
                                  {artwork.yearCreated}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {artwork.categoryName}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {ARTWORK_STATUS_LABELS[artwork.status]}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium">
                          {formatPrice(artwork.price)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => openEdit(artwork)}
                            >
                              <Pencil className="size-3.5" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteTarget(artwork)}
                            >
                              <Trash2 className="size-3.5" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <ArtworkFormDialog
        open={formOpen}
        mode={formMode}
        artwork={selected}
        artists={
          profile
            ? [
                {
                  artistId: profile.artistId,
                  fullName: profile.fullName,
                  country: profile.country,
                },
              ]
            : []
        }
        categories={categories}
        lockArtist
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete artwork?"
        description={
          deleteTarget
            ? `Delete “${deleteTarget.title}”? This cannot be undone.`
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
