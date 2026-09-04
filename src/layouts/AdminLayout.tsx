import { Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function AdminLayout() {
  const navigate = useNavigate();
  const { logout, isLoggingOut, currentUser } = useAuth();

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
                {currentUser.name}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              navigate(ROUTES.root);
              void logout();
            }}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <LoadingSpinner className="size-4" />
            ) : (
              <LogOut className="size-4" />
            )}
            Logout
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
