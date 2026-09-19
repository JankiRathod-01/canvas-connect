import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { GalleryBrand } from "@/components/common/GalleryBrand";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { LogoutButton } from "@/components/common/LogoutButton";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import {
  getDisplayFirstName,
  getPostLoginPath,
  isAdminRole,
  isArtistRole,
  isVisitorRole,
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
  const { isAuthenticated, isInitializing, currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const dashboardPath = getPostLoginPath(currentUser?.role);
  const showDashboardLink =
    isAuthenticated &&
    (isAdminRole(currentUser?.role) ||
      isArtistRole(currentUser?.role) ||
      isVisitorRole(currentUser?.role));

  const dashboardLabel = isAdminRole(currentUser?.role)
    ? "Admin"
    : isArtistRole(currentUser?.role)
      ? "Studio"
      : "My home";

  const showMyOrdersLink = isAuthenticated && isVisitorRole(currentUser?.role);

  const authActions = isInitializing ? (
    <LoadingSpinner className="size-4" label="Checking session" />
  ) : isAuthenticated ? (
    <div className="flex items-center gap-2">
      <p className="hidden max-w-32 truncate text-sm text-muted-foreground sm:block">
        Hello, {getDisplayFirstName(currentUser?.name)}
      </p>
      <LogoutButton size="sm" alwaysShowLabel={false} />
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="outline">
        <Link to={ROUTES.signup}>Sign up</Link>
      </Button>
      <Button asChild size="sm">
        <Link to={ROUTES.login}>Login</Link>
      </Button>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <GalleryBrand
          to={ROUTES.root}
          onClick={() => setIsMenuOpen(false)}
          subtitle="Curated collection"
        />

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to={ROUTES.root} className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to={ROUTES.explore} className={navLinkClass}>
              Explore
            </NavLink>
            <NavLink to={ROUTES.exhibitions} className={navLinkClass}>
              Exhibitions
            </NavLink>
            <NavLink to={ROUTES.contact} className={navLinkClass}>
              Contact
            </NavLink>
            {showMyOrdersLink ? (
              <NavLink to={ROUTES.visitorOrders} className={navLinkClass}>
                My orders
              </NavLink>
            ) : null}
            {showDashboardLink ? (
              <NavLink to={dashboardPath} className={navLinkClass}>
                {dashboardLabel}
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
            <NavLink
              to={ROUTES.explore}
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </NavLink>
            <NavLink
              to={ROUTES.exhibitions}
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Exhibitions
            </NavLink>
            <NavLink
              to={ROUTES.contact}
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>
            {showMyOrdersLink ? (
              <NavLink
                to={ROUTES.visitorOrders}
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                My orders
              </NavLink>
            ) : null}
            {showDashboardLink ? (
              <NavLink
                to={dashboardPath}
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                {dashboardLabel}
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
