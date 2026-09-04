import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  RefreshCw,
  Search,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PaginationControls } from "@/components/common/PaginationControls";
import type {
  SortDirection,
  UserListItem,
  UserSortField,
} from "@/features/users/types/user";
import { cn } from "@/utils/cn";

interface UsersTableProps {
  items: UserListItem[];
  isLoading: boolean;
  error: string | null;
  emptyTitle: string;
  emptyDescription: string;
  search: string;
  sortBy: UserSortField;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onSearchChange: (value: string) => void;
  onSort: (field: UserSortField) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRetry: () => void;
}

const SORTABLE_COLUMNS: Array<{ field: UserSortField; label: string }> = [
  { field: "name", label: "Name" },
  { field: "email", label: "Email" },
  { field: "role", label: "Role" },
  { field: "createdAt", label: "Created" },
];

function formatCreatedAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  if (!active) {
    return <ArrowUpDown className="size-3.5 opacity-50" />;
  }

  return direction === "asc" ? (
    <ArrowUp className="size-3.5" />
  ) : (
    <ArrowDown className="size-3.5" />
  );
}

export function UsersTable({
  items,
  isLoading,
  error,
  emptyTitle,
  emptyDescription,
  search,
  sortBy,
  sortDirection,
  pageNumber,
  pageSize,
  totalPages,
  totalCount,
  hasPreviousPage,
  hasNextPage,
  onSearchChange,
  onSort,
  onPageChange,
  onPageSizeChange,
  onRetry,
}: UsersTableProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name or email..."
            className="pl-9"
            aria-label="Search users"
          />
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Updating..." : `${totalCount} result${totalCount === 1 ? "" : "s"}`}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={onRetry}
          >
            <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <AlertDescription>{error}</AlertDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Try again
            </Button>
          </div>
        </Alert>
      ) : null}

      {!error && isLoading && items.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center">
          <LoadingSpinner label="Loading users" />
        </div>
      ) : null}

      {!error && !isLoading && items.length === 0 ? (
        <EmptyState
          title={search ? "No matching users" : emptyTitle}
          description={
            search
              ? "Try a different name or email search."
              : emptyDescription
          }
        />
      ) : null}

      {!error && items.length > 0 ? (
        <>
          <div className="relative overflow-x-auto rounded-lg border border-border">
            {isLoading ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60">
                <LoadingSpinner label="Updating table" />
              </div>
            ) : null}

            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                <tr>
                  {SORTABLE_COLUMNS.map((column) => {
                    const isActive = sortBy === column.field;

                    return (
                      <th key={column.field} className="px-4 py-3 font-medium">
                        <button
                          type="button"
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-md transition-colors hover:text-foreground",
                            isActive && "text-foreground",
                          )}
                          onClick={() => onSort(column.field)}
                        >
                          {column.label}
                          <SortIcon active={isActive} direction={sortDirection} />
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {items.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatCreatedAt(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControls
            pageNumber={pageNumber}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            isLoading={isLoading}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </>
      ) : null}
    </div>
  );
}
