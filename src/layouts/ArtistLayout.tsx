import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/common/LogoutButton";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function ArtistLayout() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate font-serif text-lg font-semibold sm:text-xl">
              {APP_NAME}
            </p>
            {currentUser ? (
              <p className="truncate text-xs text-muted-foreground">
                Artist · {currentUser.name}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.explore)}
            >
              Public gallery
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
