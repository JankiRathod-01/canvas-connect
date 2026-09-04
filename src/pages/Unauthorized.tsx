import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { getPostLoginPath } from "@/utils/roleRedirect";

export function Unauthorized() {
  const { isAuthenticated, currentUser } = useAuth();
  const dashboardPath = getPostLoginPath(currentUser?.role);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Access denied
      </p>
      <h1 className="mt-3 text-4xl font-semibold">Unauthorized Access</h1>
      <p className="mt-3 text-muted-foreground">
        You do not have permission to access this page.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link to={ROUTES.root}>Back to Home</Link>
        </Button>
        {isAuthenticated ? (
          <Button asChild variant="outline">
            <Link to={dashboardPath}>Go to Dashboard</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
