import { Pencil, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import type { Exhibition } from "@/features/exhibitions/types/exhibition";

interface ExhibitionsTableProps {
  items: Exhibition[];
  isLoading: boolean;
  error: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onRetry: () => void;
  onEdit: (exhibition: Exhibition) => void;
  onDelete: (exhibition: Exhibition) => void;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ExhibitionsTable({
  items,
  isLoading,
  error,
  search,
  onSearchChange,
  onRetry,
  onEdit,
  onDelete,
}: ExhibitionsTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search exhibitions..."
          className="max-w-sm"
          aria-label="Search exhibitions"
        />
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading..."
            : `${items.length} exhibition${items.length === 1 ? "" : "s"}`}
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
              <th className="px-4 py-3 font-medium">Venue</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Artworks</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <LoadingSpinner label="Loading exhibitions" />
                    Loading exhibitions...
                  </span>
                </td>
              </tr>
            ) : null}

            {!isLoading && !error && items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No exhibitions found. Create one and assign artworks.
                </td>
              </tr>
            ) : null}

            {!isLoading
              ? items.map((exhibition) => (
                  <tr
                    key={exhibition.exhibitionId}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {exhibition.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {exhibition.venue || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDate(exhibition.startDate)} –{" "}
                      {formatDate(exhibition.endDate)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {exhibition.artworkCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(exhibition)}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete(exhibition)}
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
