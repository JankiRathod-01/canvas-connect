import { PageHeader } from "@/components/common/PageHeader";
import { UsersTable } from "@/features/users/components/UsersTable";
import { useUserList } from "@/features/users/hooks/useUserList";

interface UsersListPageProps {
  kind: "visitors" | "artists";
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
}

export function UsersListPage({
  kind,
  title,
  description,
  emptyTitle,
  emptyDescription,
}: UsersListPageProps) {
  const {
    items,
    pageNumber,
    pageSize,
    totalPages,
    totalCount,
    hasPreviousPage,
    hasNextPage,
    search,
    sortBy,
    sortDirection,
    isLoading,
    error,
    setPageNumber,
    setPageSize,
    setSearch,
    toggleSort,
    refresh,
  } = useUserList({ kind });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="User management"
        title={title}
        description={description}
      />

      <UsersTable
        items={items}
        isLoading={isLoading}
        error={error}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        search={search}
        sortBy={sortBy}
        sortDirection={sortDirection}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalPages={totalPages}
        totalCount={totalCount}
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        onSearchChange={setSearch}
        onSort={toggleSort}
        onPageChange={setPageNumber}
        onPageSizeChange={setPageSize}
        onRetry={refresh}
      />
    </div>
  );
}
