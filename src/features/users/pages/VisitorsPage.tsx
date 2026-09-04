import { UsersListPage } from "@/features/users/components/UsersListPage";

export function VisitorsPage() {
  return (
    <UsersListPage
      kind="visitors"
      title="Visitors"
      description="Search, sort, and browse all visitor accounts registered in the gallery."
      emptyTitle="No visitors found"
      emptyDescription="Visitor accounts will appear here after users sign up as Visitor."
    />
  );
}
