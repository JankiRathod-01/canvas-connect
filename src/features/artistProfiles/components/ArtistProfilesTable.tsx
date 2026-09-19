import { Pencil, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import type { ArtistProfile } from "@/features/artistProfiles/types/artistProfile";

interface ArtistProfilesTableProps {
  items: ArtistProfile[];
  isLoading: boolean;
  error: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onRetry: () => void;
  onEdit: (artist: ArtistProfile) => void;
  onDelete: (artist: ArtistProfile) => void;
}

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ArtistProfilesTable({
  items,
  isLoading,
  error,
  search,
  onSearchChange,
  onRetry,
  onEdit,
  onDelete,
}: ArtistProfilesTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search artist profiles..."
          className="max-w-sm"
          aria-label="Search artist profiles"
        />
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading..."
            : `${items.length} profile${items.length === 1 ? "" : "s"}`}
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
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Artworks</th>
              <th className="px-4 py-3 font-medium">Linked account</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <LoadingSpinner label="Loading artist profiles" />
                    Loading artist profiles...
                  </span>
                </td>
              </tr>
            ) : null}

            {!isLoading && !error && items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No artist profiles yet. Add one or register an Artist account.
                </td>
              </tr>
            ) : null}

            {!isLoading
              ? items.map((artist) => (
                  <tr
                    key={artist.artistId}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {artist.fullName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {artist.country || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {artist.artworkCount}
                    </td>
                    <td className="max-w-[10rem] truncate px-4 py-3 font-mono text-xs text-muted-foreground">
                      {artist.userId || "Not linked"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDate(artist.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(artist)}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete(artist)}
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
