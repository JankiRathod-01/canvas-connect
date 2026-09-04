import { Button } from "@/components/ui/button";
import { USER_PAGE_SIZE_OPTIONS } from "@/features/users/types/user";
import { cn } from "@/utils/cn";

interface PaginationControlsProps {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function buildPageItems(pageNumber: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, pageNumber]);

  for (let offset = 1; offset <= 1; offset += 1) {
    pages.add(pageNumber - offset);
    pages.add(pageNumber + offset);
  }

  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items: Array<number | "ellipsis"> = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1]! > 1) {
      items.push("ellipsis");
    }
    items.push(page);
  });

  return items;
}

export function PaginationControls({
  pageNumber,
  totalPages,
  totalCount,
  pageSize,
  hasPreviousPage,
  hasNextPage,
  isLoading = false,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  if (totalCount === 0) {
    return null;
  }

  const startItem = (pageNumber - 1) * pageSize + 1;
  const endItem = Math.min(pageNumber * pageSize, totalCount);
  const pageItems = buildPageItems(pageNumber, Math.max(totalPages, 1));

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {startItem}-{endItem} of {totalCount}
        </p>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Rows
          <select
            className="h-9 rounded-md border border-input bg-card px-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            value={pageSize}
            disabled={isLoading}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {USER_PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage || isLoading}
          onClick={() => onPageChange(pageNumber - 1)}
        >
          Previous
        </Button>

        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={item === pageNumber ? "default" : "outline"}
              className={cn("min-w-9")}
              disabled={isLoading}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          ),
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasNextPage || isLoading}
          onClick={() => onPageChange(pageNumber + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
