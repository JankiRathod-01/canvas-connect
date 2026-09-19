import { Pencil, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ArtworkImage } from "@/features/artworks/components/ArtworkImage";
import {
  ARTWORK_STATUS_LABELS,
  type Artwork,
  type ArtworkStatusValue,
} from "@/features/artworks/types/artwork";

interface ArtworksTableProps {
  items: Artwork[];
  isLoading: boolean;
  error: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onRetry: () => void;
  onEdit: (artwork: Artwork) => void;
  onDelete: (artwork: Artwork) => void;
}

function formatPrice(price: number | null): string {
  if (price == null) {
    return "—";
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function statusLabel(status: ArtworkStatusValue): string {
  return ARTWORK_STATUS_LABELS[status] ?? String(status);
}

export function ArtworksTable({
  items,
  isLoading,
  error,
  search,
  onSearchChange,
  onRetry,
  onEdit,
  onDelete,
}: ArtworksTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search artworks..."
          className="max-w-sm"
          aria-label="Search artworks"
        />
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading..."
            : `${items.length} artwork${items.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
            <span>{error}</span>
            <Button type="button" size="sm" variant="outline" onClick={onRetry}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Artist</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <LoadingSpinner label="Loading artworks" />
                    Loading artworks...
                  </span>
                </td>
              </tr>
            ) : null}

            {!isLoading && !error && items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No artworks found. Add one with an image stored in the database.
                </td>
              </tr>
            ) : null}

            {!isLoading
              ? items.map((artwork) => (
                  <tr
                    key={artwork.artworkId}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3">
                      {artwork.hasImage ? (
                        <ArtworkImage
                          artworkId={artwork.artworkId}
                          alt={artwork.title}
                          className="size-14 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex size-14 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                          —
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      <div>{artwork.title}</div>
                      {artwork.yearCreated ? (
                        <div className="text-xs text-muted-foreground">
                          {artwork.yearCreated}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {artwork.artistName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {artwork.categoryName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatPrice(artwork.price)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {statusLabel(artwork.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(artwork)}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete(artwork)}
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
    </div>
  );
}
