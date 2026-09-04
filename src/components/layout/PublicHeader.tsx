import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { GalleryMark } from "@/components/common/GalleryMark";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import {
  getDisplayFirstName,
  isAdminRole,
} from "@/utils/roleRedirect";
import { cn } from "@/utils/cn";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground",
  );

export function PublicHeader() {
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing, currentUser, logout, isLoggingOut } =
    useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate(ROUTES.root);
    void logout();
    setIsMenuOpen(false);
  };

  const showAdminLink = isAuthenticated && isAdminRole(currentUser?.role);

  const authActions = isInitializing ? (
    <LoadingSpinner className="size-4" label="Checking session" />
  ) : isAuthenticated ? (
    <div className="flex items-center gap-2">
      <p className="hidden max-w-32 truncate text-sm text-muted-foreground sm:block">
        Hello, {getDisplayFirstName(currentUser?.name)}
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <LoadingSpinner className="size-4" />
        ) : (
          <LogOut className="size-4" />
        )}
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  ) : (
    <Button asChild size="sm">
      <Link to={ROUTES.login}>Login</Link>
    </Button>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to={ROUTES.root}
          className="flex min-w-0 items-center gap-2 text-foreground"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-background">
            <GalleryMark />
          </span>
          <span className="truncate font-serif text-lg font-semibold sm:text-xl">
            Art Gallery
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to={ROUTES.root} className={navLinkClass} end>
              Home
            </NavLink>
            {showAdminLink ? (
              <NavLink to={ROUTES.admin} className={navLinkClass}>
                Admin Panel
              </NavLink>
            ) : null}
          </nav>

          {authActions}

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink
              to={ROUTES.root}
              className={navLinkClass}
              end
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            {showAdminLink ? (
              <NavLink
                to={ROUTES.admin}
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </NavLink>
            ) : null}
            {isAuthenticated ? (
              <p className="px-3 py-2 text-sm text-muted-foreground sm:hidden">
                Hello, {getDisplayFirstName(currentUser?.name)}
              </p>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
