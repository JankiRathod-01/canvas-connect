import { UsersListPage } from "@/features/users/components/UsersListPage";

export function ArtistsPage() {
  return (
    <UsersListPage
      kind="artists"
      title="Artists"
      description="Search, sort, and browse all artist accounts registered in the gallery."
      emptyTitle="No artists found"
      emptyDescription="Artist accounts will appear here after users sign up as Artist."
    />
  );
}
