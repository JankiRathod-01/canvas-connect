import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Error
      </p>
      <h1 className="mt-3 text-6xl font-semibold">404</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you are looking for could not be found.
      </p>
      <Button asChild className="mt-8">
        <Link to={ROUTES.root}>Go to home</Link>
      </Button>
    </div>
  );
}
